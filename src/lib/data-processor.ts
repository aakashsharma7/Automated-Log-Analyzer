import { LogEntry, LogAnalysis, BasicStats, TimeAnalysis, ErrorAnalysis, IpAnalysis, SourceAnalysis, PerformanceMetrics, SecurityAnalysis, Recommendation } from '@/types'

export class DataProcessor {
  private logStatsCache: Map<string, LogAnalysis> = new Map()
  private cacheExpiry: Map<string, Date> = new Map()
  private cacheDuration = 5 * 60 * 1000 // 5 minutes

  processLogs(logs: LogEntry[]): LogAnalysis {
    if (!logs.length) return this.getEmptyStats()

    // Check cache first
    const cacheKey = this.getCacheKey(logs)
    if (this.isCacheValid(cacheKey)) {
      return this.logStatsCache.get(cacheKey)!
    }

    console.log(`Processing ${logs.length} logs`)

    // Convert timestamp strings to Date objects if needed - optimized batch processing
    const processedLogs = logs.map(log => ({
      ...log,
      timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)
    }))

    // Process all analyses in parallel where possible
    const [basicStats, timeAnalysis, errorAnalysis, ipAnalysis, sourceAnalysis, performanceMetrics, securityAnalysis, recommendations] = [
      this.calculateBasicStats(processedLogs),
      this.analyzeTimePatterns(processedLogs),
      this.analyzeErrors(processedLogs),
      this.analyzeIpPatterns(processedLogs),
      this.analyzeSources(processedLogs),
      this.calculatePerformanceMetrics(processedLogs),
      this.analyzeSecurityPatterns(processedLogs),
      this.getRecommendations(processedLogs)
    ]

    const result = {
      basicStats,
      timeAnalysis,
      errorAnalysis,
      ipAnalysis,
      sourceAnalysis,
      performanceMetrics,
      securityAnalysis,
      recommendations,
      processedAt: new Date().toISOString()
    }

    // Cache the result
    this.cacheResult(cacheKey, result)

    return result
  }

  private calculateBasicStats(logs: LogEntry[]): BasicStats {
    const stats: BasicStats = {
      totalLogs: logs.length,
      uniqueSources: new Set(logs.map(l => l.source).filter(Boolean)).size,
      uniqueIps: new Set(logs.map(l => l.ipAddress).filter(Boolean)).size,
      dateRange: {
        start: logs.length ? logs[0].timestamp.toISOString() : null,
        end: logs.length ? logs[logs.length - 1].timestamp.toISOString() : null
      }
    }

    // Log level distribution
    const levelCounts = this.groupBy(logs, 'level')
    stats.levelDistribution = Object.fromEntries(
      Object.entries(levelCounts).map(([level, logs]) => [level, logs.length])
    )
    stats.errorRate = (levelCounts.ERROR?.length || 0) / logs.length * 100
    stats.warningRate = (levelCounts.WARNING?.length || 0) / logs.length * 100

    // Status code distribution
    const statusCounts = this.groupBy(logs, 'statusCode')
    stats.statusDistribution = Object.fromEntries(
      Object.entries(statusCounts).map(([status, logs]) => [status, logs.length])
    )
    stats.errorStatusRate = logs.filter(l => l.statusCode && l.statusCode >= 400).length / logs.length * 100
    stats.serverErrorRate = logs.filter(l => l.statusCode && l.statusCode >= 500).length / logs.length * 100

    return stats
  }

  private analyzeTimePatterns(logs: LogEntry[]): TimeAnalysis {
    if (!logs.length) return {}

    const hourlyCounts = new Map<number, number>()
    const dailyCounts = new Map<number, number>()
    const dateCounts = new Map<string, number>()

    for (const log of logs) {
      const hour = log.timestamp.getHours()
      const dayOfWeek = log.timestamp.getDay()
      const date = log.timestamp.toISOString().split('T')[0]

      hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1)
      dailyCounts.set(dayOfWeek, (dailyCounts.get(dayOfWeek) || 0) + 1)
      dateCounts.set(date, (dateCounts.get(date) || 0) + 1)
    }

    const analysis: TimeAnalysis = {
      hourlyDistribution: Object.fromEntries(hourlyCounts),
      dailyDistribution: Object.fromEntries(dailyCounts),
      dateDistribution: Object.fromEntries(dateCounts)
    }

    // Find peak times
    const maxHour = Array.from(hourlyCounts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)
    const maxDay = Array.from(dailyCounts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)
    
    analysis.peakHour = maxHour[0]
    analysis.peakDay = maxDay[0]

    // Calculate log rate
    if (logs.length > 1) {
      const timeDiff = (logs[logs.length - 1].timestamp.getTime() - logs[0].timestamp.getTime()) / 1000
      if (timeDiff > 0) {
        analysis.logsPerSecond = logs.length / timeDiff
        analysis.logsPerMinute = analysis.logsPerSecond * 60
        analysis.logsPerHour = analysis.logsPerSecond * 3600
      }
    }

    return analysis
  }

  private analyzeErrors(logs: LogEntry[]): ErrorAnalysis {
    const errorLogs = logs.filter(log => 
      log.level === 'ERROR' || (log.statusCode && log.statusCode >= 400)
    )

    if (!errorLogs.length) return { totalErrors: 0 }

    const analysis: ErrorAnalysis = {
      totalErrors: errorLogs.length,
      errorRate: errorLogs.length / logs.length * 100
    }

    // Top error sources
    const sourceCounts = this.groupBy(errorLogs, 'source')
    analysis.topErrorSources = Object.fromEntries(
      Object.entries(sourceCounts).map(([source, logs]) => [source, logs.length])
    )

    // Common error patterns
    if (errorLogs.some(log => log.message)) {
      const messages = errorLogs.map(log => log.message?.toLowerCase() || '')
      analysis.commonErrorPatterns = this.extractCommonPatterns(messages)
    }

    // Error status codes
    const statusCounts = this.groupBy(errorLogs, 'statusCode')
    analysis.errorStatusCodes = Object.fromEntries(
      Object.entries(statusCounts).map(([status, logs]) => [status, logs.length])
    )

    return analysis
  }

  private analyzeIpPatterns(logs: LogEntry[]): IpAnalysis {
    const ipLogs = logs.filter(log => log.ipAddress)
    if (!ipLogs.length) return {}

    const ipCounts = new Map<string, number>()
    for (const log of ipLogs) {
      if (log.ipAddress) {
        ipCounts.set(log.ipAddress, (ipCounts.get(log.ipAddress) || 0) + 1)
      }
    }

    const analysis: IpAnalysis = {
      totalUniqueIps: ipCounts.size,
      topIps: Object.fromEntries(
        Array.from(ipCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
      ),
      ipDistribution: {
        singleRequest: Array.from(ipCounts.values()).filter(count => count === 1).length,
        multipleRequests: Array.from(ipCounts.values()).filter(count => count > 1).length,
        highVolumeIps: Array.from(ipCounts.values()).filter(count => count > 100).length
      }
    }

    // Identify suspicious IPs
    analysis.suspiciousIps = this.identifySuspiciousIps(logs)

    return analysis
  }

  private analyzeSources(logs: LogEntry[]): SourceAnalysis {
    const sourceCounts = this.groupBy(logs, 'source')
    
    const analysis: SourceAnalysis = {
      totalSources: Object.keys(sourceCounts).length,
      sourceDistribution: Object.fromEntries(
        Object.entries(sourceCounts).map(([source, logs]) => [source, logs.length])
      ),
      topSources: Object.fromEntries(
        Object.entries(sourceCounts)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 10)
          .map(([source, logs]) => [source, logs.length])
      )
    }

    // Source-specific analysis
    const sourceDetails: Record<string, any> = {}
    for (const [source, sourceLogs] of Object.entries(sourceCounts)) {
      const errorCount = sourceLogs.filter(log => log.level === 'ERROR').length
      const avgResponseSize = sourceLogs
        .filter(log => log.responseSize)
        .reduce((sum, log) => sum + (log.responseSize || 0), 0) / sourceLogs.length

      sourceDetails[source] = {
        logCount: sourceLogs.length,
        errorRate: errorCount / sourceLogs.length * 100,
        avgResponseSize: avgResponseSize || 0
      }
    }
    analysis.sourceDetails = sourceDetails

    return analysis
  }

  private calculatePerformanceMetrics(logs: LogEntry[]): PerformanceMetrics {
    const metrics: PerformanceMetrics = {}

    // Response size analysis
    const responseSizes = logs
      .filter(log => log.responseSize)
      .map(log => log.responseSize!)
    
    if (responseSizes.length) {
      const sorted = responseSizes.sort((a, b) => a - b)
      metrics.responseSize = {
        mean: responseSizes.reduce((sum, size) => sum + size, 0) / responseSizes.length,
        median: sorted[Math.floor(sorted.length / 2)],
        std: this.calculateStandardDeviation(responseSizes),
        min: Math.min(...responseSizes),
        max: Math.max(...responseSizes),
        percentile95: this.calculatePercentile(responseSizes, 95),
        percentile99: this.calculatePercentile(responseSizes, 99)
      }
    }

    // Request method analysis
    const methodCounts = this.groupBy(logs, 'method')
    metrics.requestMethods = Object.fromEntries(
      Object.entries(methodCounts).map(([method, logs]) => [method, logs.length])
    )

    // URL analysis
    const urlLogs = logs.filter(log => log.url)
    if (urlLogs.length) {
      const urlLengths = urlLogs.map(log => log.url!.length)
      metrics.urlLength = {
        mean: urlLengths.reduce((sum, len) => sum + len, 0) / urlLengths.length,
        max: Math.max(...urlLengths),
        longUrls: urlLengths.filter(len => len > 200).length
      }
    }

    return metrics
  }

  private analyzeSecurityPatterns(logs: LogEntry[]): SecurityAnalysis {
    const securityAnalysis: SecurityAnalysis = {
      potentialThreats: 0,
      suspiciousPatterns: [],
      failedAttempts: 0
    }

    const attackPatterns = [
      { pattern: /(sql injection|union select|drop table)/i, name: 'SQL Injection' },
      { pattern: /(xss|cross.site|script>)/i, name: 'XSS Attack' },
      { pattern: /(directory traversal|\.\.\/)/i, name: 'Directory Traversal' },
      { pattern: /(brute force|failed login)/i, name: 'Brute Force' },
      { pattern: /(unauthorized|forbidden|access denied)/i, name: 'Unauthorized Access' },
      { pattern: /(injection|payload|exploit)/i, name: 'Injection Attack' }
    ]

    for (const { pattern, name } of attackPatterns) {
      const matchingLogs = logs.filter(log => 
        log.message && pattern.test(log.message)
      )

      if (matchingLogs.length > 0) {
        securityAnalysis.suspiciousPatterns.push({
          pattern: name,
          count: matchingLogs.length,
          examples: matchingLogs.slice(0, 3).map(log => log.message!)
        })
        securityAnalysis.potentialThreats += matchingLogs.length
      }
    }

    // Count failed authentication attempts
    securityAnalysis.failedAttempts = logs.filter(log => 
      log.statusCode === 401
    ).length

    return securityAnalysis
  }

  getRecommendations(logs: LogEntry[]): Recommendation[] {
    if (!logs.length) return []

    const recommendations: Recommendation[] = []

    // HTTP status based recommendations
    const statusCounts = this.groupBy(logs, 'statusCode')
    const error500Count = statusCounts['500']?.length || 0
    const error502Count = statusCounts['502']?.length || 0
    const error503Count = statusCounts['503']?.length || 0
    const error404Count = statusCounts['404']?.length || 0
    const error401Count = statusCounts['401']?.length || 0
    const error403Count = statusCounts['403']?.length || 0

    if (error500Count > 0) {
      recommendations.push({
        reason: 'Frequent 500 errors',
        advice: 'Check application error logs and stack traces. Review recent deploys, enable error monitoring, and add guards around failing code paths.',
        count: error500Count,
        examples: logs.filter(log => log.statusCode === 500).slice(0, 3).map(log => log.message || '')
      })
    }

    if (error502Count + error503Count > 0) {
      recommendations.push({
        reason: 'Many 502/503 upstream failures',
        advice: 'Upstream service likely unhealthy. Verify reverse proxy/upstream targets, health checks, and autoscaling. Inspect upstream service logs.',
        count: error502Count + error503Count,
        examples: logs.filter(log => [502, 503].includes(log.statusCode || 0)).slice(0, 3).map(log => log.message || '')
      })
    }

    if (error404Count > 0) {
      recommendations.push({
        reason: 'Many 404 responses',
        advice: 'Requests hitting unknown routes or missing assets. Validate URLs, client routing, and asset paths. Add redirects or route fallbacks as needed.',
        count: error404Count,
        examples: logs.filter(log => log.statusCode === 404).slice(0, 3).map(log => log.message || '')
      })
    }

    if (error401Count + error403Count > 0) {
      recommendations.push({
        reason: 'Authentication/Authorization issues (401/403)',
        advice: 'Confirm auth headers/tokens, session validity, and RBAC permissions. Rotate invalid tokens and verify CORS for browser clients.',
        count: error401Count + error403Count,
        examples: logs.filter(log => [401, 403].includes(log.statusCode || 0)).slice(0, 3).map(log => log.message || '')
      })
    }

    // Message-based patterns
    const messageLogs = logs.filter(log => log.message)
    if (messageLogs.length > 0) {
      const messages = messageLogs.map(log => log.message!.toLowerCase())

      const timeoutCount = messages.filter(msg => 
        msg.includes('timeout') || msg.includes('timed out') || msg.includes('request timed')
      ).length

      if (timeoutCount > 0) {
        recommendations.push({
          reason: 'Timeouts detected',
          advice: 'Increase timeouts or optimize slow calls. Add retries with backoff and circuit breakers. Profile slow queries/endpoints.',
          count: timeoutCount,
          examples: messageLogs.filter(log => 
            log.message?.toLowerCase().includes('timeout') || 
            log.message?.toLowerCase().includes('timed out')
          ).slice(0, 3).map(log => log.message!)
        })
      }

      const connectionErrorCount = messages.filter(msg => 
        msg.includes('connection refused') || 
        msg.includes('connection failed') || 
        msg.includes('reset by peer')
      ).length

      if (connectionErrorCount > 0) {
        recommendations.push({
          reason: 'Connection refused/errors',
          advice: 'Target service likely down or port/firewall misconfigured. Verify host/port, DNS, security groups, and service health.',
          count: connectionErrorCount,
          examples: messageLogs.filter(log => 
            log.message?.toLowerCase().includes('connection refused') ||
            log.message?.toLowerCase().includes('connection failed')
          ).slice(0, 3).map(log => log.message!)
        })
      }
    }

    return recommendations.slice(0, 8) // Limit to top 8 recommendations
  }

  private identifySuspiciousIps(logs: LogEntry[]): Array<{
    ip: string
    suspiciousScore: number
    reasons: string[]
    stats: Record<string, any>
  }> {
    const ipStats = new Map<string, {
      requestCount: number
      errorCount: number
      errorLevelCount: number
      firstRequest: Date
      lastRequest: Date
    }>()

    for (const log of logs) {
      if (!log.ipAddress) continue

      const ip = log.ipAddress
      const stats = ipStats.get(ip) || {
        requestCount: 0,
        errorCount: 0,
        errorLevelCount: 0,
        firstRequest: log.timestamp,
        lastRequest: log.timestamp
      }

      stats.requestCount++
      if (log.statusCode && log.statusCode >= 400) stats.errorCount++
      if (log.level === 'ERROR') stats.errorLevelCount++
      if (log.timestamp < stats.firstRequest) stats.firstRequest = log.timestamp
      if (log.timestamp > stats.lastRequest) stats.lastRequest = log.timestamp

      ipStats.set(ip, stats)
    }

    const suspiciousIps: Array<{
      ip: string
      suspiciousScore: number
      reasons: string[]
      stats: Record<string, any>
    }> = []

    for (const [ip, stats] of Array.from(ipStats.entries())) {
      let suspiciousScore = 0
      const reasons: string[] = []

      if (stats.requestCount > 1000) {
        suspiciousScore += 3
        reasons.push(`High request volume: ${stats.requestCount}`)
      }

      if (stats.requestCount > 0) {
        const errorRate = stats.errorCount / stats.requestCount
        if (errorRate > 0.5) {
          suspiciousScore += 2
          reasons.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`)
        }
      }

      if (stats.errorLevelCount > 10) {
        suspiciousScore += 2
        reasons.push(`Many error level logs: ${stats.errorLevelCount}`)
      }

      if (suspiciousScore > 0) {
        suspiciousIps.push({
          ip,
          suspiciousScore,
          reasons,
          stats: {
            requestCount: stats.requestCount,
            errorCount: stats.errorCount,
            errorLevelCount: stats.errorLevelCount,
            firstRequest: stats.firstRequest.toISOString(),
            lastRequest: stats.lastRequest.toISOString()
          }
        })
      }
    }

    return suspiciousIps.sort((a, b) => b.suspiciousScore - a.suspiciousScore)
  }

  private extractCommonPatterns(messages: string[]): Array<{
    pattern: string
    count: number
    percentage: number
  }> {
    const patterns = [
      { regex: /(timeout|timed out)/i, name: 'Timeout' },
      { regex: /(connection refused|connection failed)/i, name: 'Connection Error' },
      { regex: /(permission denied|access denied)/i, name: 'Permission Denied' },
      { regex: /(file not found|404)/i, name: 'File Not Found' },
      { regex: /(internal server error|500)/i, name: 'Internal Server Error' },
      { regex: /(database error|sql error)/i, name: 'Database Error' },
      { regex: /(memory error|out of memory)/i, name: 'Memory Error' },
      { regex: /(disk full|no space)/i, name: 'Disk Full' }
    ]

    const patternCounts = patterns.map(({ regex, name }) => {
      const matches = messages.filter(msg => regex.test(msg))
      return {
        pattern: name,
        count: matches.length,
        percentage: (matches.length / messages.length) * 100
      }
    }).filter(p => p.count > 0)

    return patternCounts.sort((a, b) => b.count - a.count)
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key] || 'unknown')
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(avgSquaredDiff)
  }

  private calculatePercentile(data: number[], percentile: number): number {
    const sorted = [...data].sort((a, b) => a - b)
    const index = (percentile / 100) * (sorted.length - 1)
    
    if (Number.isInteger(index)) {
      return sorted[index]
    }
    
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index - lower
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight
  }

  private getEmptyStats(): LogAnalysis {
    return {
      basicStats: { totalLogs: 0, uniqueSources: 0, uniqueIps: 0, dateRange: { start: null, end: null } },
      timeAnalysis: {},
      errorAnalysis: { totalErrors: 0 },
      ipAnalysis: {},
      sourceAnalysis: {},
      performanceMetrics: {},
      securityAnalysis: { potentialThreats: 0, suspiciousPatterns: [], failedAttempts: 0 },
      recommendations: [],
      processedAt: new Date().toISOString()
    }
  }

  private getCacheKey(logs: LogEntry[]): string {
    // Create a simple hash based on log count and first/last timestamps
    const count = logs.length
    const firstTimestamp = logs[0]?.timestamp?.toISOString() || ''
    const lastTimestamp = logs[logs.length - 1]?.timestamp?.toISOString() || ''
    return `${count}-${firstTimestamp}-${lastTimestamp}`
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey)
    return expiry ? new Date() < expiry : false
  }

  private cacheResult(cacheKey: string, result: LogAnalysis): void {
    this.logStatsCache.set(cacheKey, result)
    this.cacheExpiry.set(cacheKey, new Date(Date.now() + this.cacheDuration))
  }
}
