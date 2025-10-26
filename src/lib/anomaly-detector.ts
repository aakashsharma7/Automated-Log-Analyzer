import { LogEntry, AnomalyDetectionResult } from '@/types'

interface IsolationForestNode {
  feature: number
  threshold: number
  left?: IsolationForestNode
  right?: IsolationForestNode
  size: number
}

interface IsolationTree {
  root: IsolationForestNode
  maxDepth: number
}

export class AnomalyDetector {
  private contamination: number
  private randomState: number
  private trees: IsolationTree[] = []
  private nEstimators: number = 100
  private maxSamples: number = 256
  private maxFeatures: number = 1.0
  private maxDepth: number = 10
  private isFitted: boolean = false
  private featureNames: string[] = []
  private scaler: { mean: number[]; std: number[] } | null = null

  constructor(contamination: number = 0.1, randomState: number = 42) {
    this.contamination = contamination
    this.randomState = randomState
  }

  fit(logs: LogEntry[]): void {
    if (!logs.length) {
      console.warn('No logs provided for fitting')
      return
    }

    console.log(`Fitting anomaly detection model with ${logs.length} logs`)

    const features = this.prepareFeatures(logs)
    if (!features.length) {
      console.warn('No features could be extracted from logs')
      return
    }

    // Normalize features
    this.normalizeFeatures(features)

    // Build isolation forest
    this.buildIsolationForest(features)
    this.isFitted = true

    console.log('Anomaly detection model fitted successfully')
  }

  detectAnomalies(logs: LogEntry[], threshold?: number): AnomalyDetectionResult {
    if (!this.isFitted) {
      console.warn('Model not fitted. Please fit the model first.')
      return { total: 0, anomalies: [], summary: { totalAnomalies: 0, anomalyTypes: {}, topSources: {}, severityDistribution: {} } }
    }

    if (!logs.length) {
      return { total: 0, anomalies: [], summary: { totalAnomalies: 0, anomalyTypes: {}, topSources: {}, severityDistribution: {} } }
    }

    const features = this.prepareFeatures(logs)
    if (!features.length) {
      return { total: 0, anomalies: [], summary: { totalAnomalies: 0, anomalyTypes: {}, topSources: {}, severityDistribution: {} } }
    }

    // Normalize features
    const normalizedFeatures = this.normalizeFeatures(features)

    // Predict anomalies
    const anomalyScores = this.predictAnomalyScores(normalizedFeatures)
    const anomalyLabels = threshold !== undefined 
      ? anomalyScores.map(score => score < threshold ? 1 : 0)
      : this.getAnomalyLabels(anomalyScores)

    // Create results
    const results = logs.map((log, index) => ({
      ...log,
      anomalyScore: anomalyScores[index],
      isAnomaly: anomalyLabels[index] === 1,
      anomalyType: this.classifyAnomalyType(log, anomalyScores[index])
    }))

    const anomalies = results.filter(result => result.isAnomaly)

    return {
      total: anomalies.length,
      anomalies: anomalies.slice(0, 50), // Limit to top 50
      summary: this.getAnomalySummary(anomalies)
    }
  }

  private prepareFeatures(logs: LogEntry[]): number[][] {
    const features: number[][] = []

    for (const log of logs) {
      const featureVector: number[] = []

      // Time-based features
      const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)
      featureVector.push(timestamp.getHours())
      featureVector.push(timestamp.getDay())
      featureVector.push(timestamp.getDate())
      featureVector.push(timestamp.getDay() >= 5 ? 1 : 0) // is_weekend

      // Log level features
      const levelMapping: Record<string, number> = { 'ERROR': 4, 'WARNING': 3, 'INFO': 2, 'DEBUG': 1, 'UNKNOWN': 0 }
      featureVector.push(levelMapping[log.level || 'UNKNOWN'] || 0)

      // Status code features
      const statusCode = log.statusCode || 200
      featureVector.push(statusCode)
      featureVector.push(statusCode >= 400 ? 1 : 0)
      featureVector.push(statusCode >= 500 ? 1 : 0)

      // Response size features
      const responseSize = log.responseSize || 0
      featureVector.push(responseSize)
      featureVector.push(Math.log1p(responseSize))

      // IP address features (simplified)
      const ipCount = logs.filter(l => l.ipAddress === log.ipAddress).length
      featureVector.push(ipCount)

      // Message-based features
      const message = log.message || ''
      featureVector.push(message.length)
      featureVector.push(message.split(' ').length)
      featureVector.push(message.toLowerCase().includes('error') || message.toLowerCase().includes('exception') || message.toLowerCase().includes('fail') || message.toLowerCase().includes('timeout') || message.toLowerCase().includes('denied') ? 1 : 0)
      featureVector.push(message.toLowerCase().includes('select') || message.toLowerCase().includes('insert') || message.toLowerCase().includes('update') || message.toLowerCase().includes('delete') || message.toLowerCase().includes('sql') ? 1 : 0)
      featureVector.push(message.toLowerCase().includes('http') || message.toLowerCase().includes('request') || message.toLowerCase().includes('response') || message.toLowerCase().includes('api') ? 1 : 0)

      // Source features (simplified hash)
      const sourceHash = this.hashString(log.source || 'unknown')
      featureVector.push(sourceHash)

      // URL features
      const url = log.url || ''
      featureVector.push(url.length)
      featureVector.push(url.includes('?') ? 1 : 0)
      featureVector.push(/[<>"']/.test(url) ? 1 : 0)

      // Method features
      const methodMapping: Record<string, number> = { 'GET': 1, 'POST': 2, 'PUT': 3, 'DELETE': 4, 'PATCH': 5 }
      featureVector.push(methodMapping[log.method || 'GET'] || 0)

      features.push(featureVector)
    }

    // Store feature names for reference
    this.featureNames = [
      'hour', 'day_of_week', 'day_of_month', 'is_weekend',
      'level_numeric', 'status_code', 'is_error_status', 'is_server_error',
      'response_size', 'response_size_log', 'ip_count',
      'message_length', 'message_word_count', 'has_error_keywords', 'has_sql_keywords', 'has_http_keywords',
      'source_encoded', 'url_length', 'has_query_params', 'has_special_chars', 'method_encoded'
    ]

    return features
  }

  private normalizeFeatures(features: number[][]): number[][] {
    if (!features.length) return features

    const numFeatures = features[0].length
    const normalizedFeatures: number[][] = []

    // Calculate mean and std for each feature
    const means: number[] = []
    const stds: number[] = []

    for (let i = 0; i < numFeatures; i++) {
      const values = features.map(f => f[i])
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      const std = Math.sqrt(variance)

      means.push(mean)
      stds.push(std === 0 ? 1 : std) // Avoid division by zero
    }

    // Store scaler for later use
    this.scaler = { mean: means, std: stds }

    // Normalize features
    for (const featureVector of features) {
      const normalized = featureVector.map((value, i) => (value - means[i]) / stds[i])
      normalizedFeatures.push(normalized)
    }

    return normalizedFeatures
  }

  private buildIsolationForest(features: number[][]): void {
    this.trees = []

    for (let i = 0; i < this.nEstimators; i++) {
      const tree = this.buildIsolationTree(features, 0, this.maxDepth)
      this.trees.push(tree)
    }
  }

  private buildIsolationTree(features: number[][], depth: number, maxDepth: number): IsolationTree {
    if (features.length <= 1 || depth >= maxDepth) {
      return {
        root: { feature: -1, threshold: 0, size: features.length },
        maxDepth
      }
    }

    const numFeatures = features[0].length
    const randomFeature = Math.floor(Math.random() * numFeatures)
    const values = features.map(f => f[randomFeature])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const threshold = min + Math.random() * (max - min)

    const leftFeatures = features.filter(f => f[randomFeature] < threshold)
    const rightFeatures = features.filter(f => f[randomFeature] >= threshold)

    const leftTree = this.buildIsolationTree(leftFeatures, depth + 1, maxDepth)
    const rightTree = this.buildIsolationTree(rightFeatures, depth + 1, maxDepth)

    return {
      root: {
        feature: randomFeature,
        threshold,
        left: leftTree.root,
        right: rightTree.root,
        size: features.length
      },
      maxDepth
    }
  }

  private predictAnomalyScores(features: number[][]): number[] {
    const scores: number[] = []

    for (const featureVector of features) {
      let totalScore = 0
      for (const tree of this.trees) {
        const pathLength = this.getPathLength(featureVector, tree.root)
        const expectedPathLength = this.getExpectedPathLength(tree.root.size)
        const score = Math.pow(2, -pathLength / expectedPathLength)
        totalScore += score
      }
      scores.push(totalScore / this.trees.length)
    }

    return scores
  }

  private getPathLength(featureVector: number[], node: IsolationForestNode): number {
    if (node.feature === -1) {
      return this.getExpectedPathLength(node.size)
    }

    if (featureVector[node.feature] < node.threshold) {
      return node.left ? this.getPathLength(featureVector, node.left) + 1 : 1
    } else {
      return node.right ? this.getPathLength(featureVector, node.right) + 1 : 1
    }
  }

  private getExpectedPathLength(n: number): number {
    if (n <= 1) return 0
    return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1)) / n
  }

  private getAnomalyLabels(scores: number[]): number[] {
    const sortedScores = [...scores].sort((a, b) => a - b)
    const thresholdIndex = Math.floor(scores.length * this.contamination)
    const threshold = sortedScores[thresholdIndex]

    return scores.map(score => score < threshold ? 1 : 0)
  }

  private classifyAnomalyType(log: LogEntry, score: number): string {
    // High error rate
    if (log.level === 'ERROR' || (log.statusCode && log.statusCode >= 500)) {
      return 'error_spike'
    }

    // Unusual time pattern
    const hour = log.timestamp instanceof Date ? log.timestamp.getHours() : new Date(log.timestamp).getHours()
    if (hour < 6 || hour > 22) {
      return 'unusual_time'
    }

    // Large response size
    if (log.responseSize && log.responseSize > 1000000) {
      return 'large_response'
    }

    // Suspicious IP activity (simplified)
    if (score < -0.5) {
      return 'suspicious_ip'
    }

    // SQL injection attempt
    if (log.message && log.url) {
      const hasSqlKeywords = /(select|insert|update|delete|sql)/i.test(log.message)
      const hasSpecialChars = /[<>"']/.test(log.url)
      if (hasSqlKeywords && hasSpecialChars) {
        return 'potential_sql_injection'
      }
    }

    // Unusual request pattern
    if (log.method && log.method !== 'GET' && log.url && log.url.includes('?')) {
      return 'unusual_request'
    }

    return 'unknown'
  }

  private getAnomalySummary(anomalies: LogEntry[]): {
    totalAnomalies: number
    anomalyTypes: Record<string, number>
    topSources: Record<string, number>
    severityDistribution: Record<string, number>
    timeDistribution?: {
      byHour: Record<string, number>
      byDay: Record<string, number>
    }
  } {
    if (!anomalies.length) {
      return {
        totalAnomalies: 0,
        anomalyTypes: {},
        topSources: {},
        severityDistribution: {}
      }
    }

    const summary: any = {
      totalAnomalies: anomalies.length,
      anomalyTypes: this.groupBy(anomalies as any[], 'anomalyType'),
      topSources: this.groupBy(anomalies, 'source'),
      severityDistribution: this.groupBy(anomalies, 'level')
    }

    // Time distribution
    const byHour: Record<string, number> = {}
    const byDay: Record<string, number> = {}

    for (const anomaly of anomalies) {
      const timestamp = anomaly.timestamp instanceof Date ? anomaly.timestamp : new Date(anomaly.timestamp)
      const hour = timestamp.getHours().toString()
      const day = timestamp.toISOString().split('T')[0]

      byHour[hour] = (byHour[hour] || 0) + 1
      byDay[day] = (byDay[day] || 0) + 1
    }

    summary.timeDistribution = { byHour, byDay }

    return summary
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((groups, item) => {
      const group = String(item[key] || 'unknown')
      groups[group] = (groups[group] || 0) + 1
      return groups
    }, {} as Record<string, number>)
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 1000 // Normalize to 0-999 range
  }
}
