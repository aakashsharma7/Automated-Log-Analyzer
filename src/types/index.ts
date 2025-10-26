export interface LogEntry {
  id?: number
  timestamp: Date
  level?: string
  source?: string
  message?: string
  ipAddress?: string
  statusCode?: number
  responseSize?: number
  userAgent?: string
  method?: string
  url?: string
  protocol?: string
  hostname?: string
  service?: string
  rawLog: string
  jsonData?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export interface Anomaly {
  id?: number
  logId: number
  anomalyScore: number
  anomalyType: string
  isResolved: boolean
  detectedAt: Date
  resolvedAt?: Date
  createdAt?: Date
  updatedAt?: Date
  log?: LogEntry
}

export interface LogStats {
  id?: number
  date: Date
  totalLogs: number
  errorCount: number
  warningCount: number
  infoCount: number
  uniqueIps: number
  avgResponseTime?: number
  avgResponseSize?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface AiAnalysis {
  id?: number
  logId?: number
  analysisType: 'recommendation' | 'summary' | 'anomaly_explanation'
  prompt: string
  response: string
  model: string
  confidence?: number
  processingTime?: number
  createdAt?: Date
}

export interface ParsedLogs {
  rows: number
  columns: string[]
  sample: LogEntry[]
  stats: LogAnalysis
}

export interface LogAnalysis {
  basicStats: BasicStats
  timeAnalysis: TimeAnalysis
  errorAnalysis: ErrorAnalysis
  ipAnalysis: IpAnalysis
  sourceAnalysis: SourceAnalysis
  performanceMetrics: PerformanceMetrics
  securityAnalysis: SecurityAnalysis
  recommendations: Recommendation[]
  processedAt: string
}

export interface BasicStats {
  totalLogs: number
  uniqueSources: number
  uniqueIps: number
  dateRange: {
    start: string | null
    end: string | null
  }
  levelDistribution?: Record<string, number>
  errorRate?: number
  warningRate?: number
  statusDistribution?: Record<string, number>
  errorStatusRate?: number
  serverErrorRate?: number
}

export interface TimeAnalysis {
  hourlyDistribution?: Record<string, number>
  dailyDistribution?: Record<string, number>
  dateDistribution?: Record<string, number>
  peakHour?: number
  peakDay?: number
  logsPerSecond?: number
  logsPerMinute?: number
  logsPerHour?: number
}

export interface ErrorAnalysis {
  totalErrors: number
  errorRate?: number
  topErrorSources?: Record<string, number>
  errorTrend?: {
    trendSlope: number
    trendDirection: string
    hourlyCounts: Record<string, number>
  }
  commonErrorPatterns?: Array<{
    pattern: string
    count: number
    percentage: number
  }>
  errorStatusCodes?: Record<string, number>
}

export interface IpAnalysis {
  totalUniqueIps?: number
  topIps?: Record<string, number>
  ipDistribution?: {
    singleRequest: number
    multipleRequests: number
    highVolumeIps: number
  }
  suspiciousIps?: Array<{
    ip: string
    suspiciousScore: number
    reasons: string[]
    stats: Record<string, any>
  }>
}

export interface SourceAnalysis {
  totalSources?: number
  sourceDistribution?: Record<string, number>
  topSources?: Record<string, number>
  sourceDetails?: Record<string, {
    logCount: number
    errorRate: number
    avgResponseSize: number
  }>
}

export interface PerformanceMetrics {
  responseSize?: {
    mean: number
    median: number
    std: number
    min: number
    max: number
    percentile95: number
    percentile99: number
  }
  requestMethods?: Record<string, number>
  urlLength?: {
    mean: number
    max: number
    longUrls: number
  }
}

export interface SecurityAnalysis {
  potentialThreats: number
  suspiciousPatterns: Array<{
    pattern: string
    count: number
    examples: string[]
  }>
  failedAttempts: number
}

export interface Recommendation {
  reason: string
  advice: string
  count: number
  examples: string[]
}

export interface AnomalyDetectionResult {
  total: number
  anomalies: LogEntry[]
  summary: {
    totalAnomalies: number
    anomalyTypes: Record<string, number>
    topSources: Record<string, number>
    severityDistribution: Record<string, number>
    timeDistribution?: {
      byHour: Record<string, number>
      byDay: Record<string, number>
    }
  }
}

export interface AiRecommendations {
  rootCause: string
  fixSteps: string[]
  prevention: string[]
  monitoring: string[]
  references: string[]
  confidence: string
}

export interface LogFormat {
  name: string
  pattern: RegExp
  parser: (line: string) => LogEntry
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  label?: string
}

export interface DashboardMetrics {
  totalLogs: number
  errorRate: number
  uniqueSources: number
  uniqueIps: number
  anomaliesDetected: number
  avgResponseTime: number
  topErrors: Array<{
    message: string
    count: number
  }>
  recentActivity: LogEntry[]
}
