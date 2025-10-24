'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogEntry, LogAnalysis, AnomalyDetectionResult, AiRecommendations } from '@/types'
import { LogMetrics } from './log-metrics'
import { LogTable } from './log-table'
import { AnomalyTable } from './anomaly-table'
import { AiRecommendationsCard } from './ai-recommendations-card'
import { LogCharts } from './log-charts'
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  TrendingUp, 
  Users, 
  Server,
  Clock,
  Shield
} from 'lucide-react'

interface LogAnalysisResultsProps {
  result?: {
    rows: number
    columns: string[]
    sample: LogEntry[]
    stats: LogAnalysis
  } | null
  anomalyResult?: AnomalyDetectionResult | null
  aiRecommendations?: {
    ai_recommendations: AiRecommendations
    context: any
  } | null
}

export function LogAnalysisResults({ 
  result, 
  anomalyResult, 
  aiRecommendations 
}: LogAnalysisResultsProps) {
  if (!result && !anomalyResult) return null

  const stats = result?.stats
  const anomalies = anomalyResult?.anomalies || []
  const totalAnomalies = anomalyResult?.total || 0

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Logs</p>
                  <p className="text-2xl font-bold text-white">{stats.basicStats.totalLogs.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Error Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.basicStats.errorRate || 0).toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Unique Sources</p>
                  <p className="text-2xl font-bold text-white">{stats.basicStats.uniqueSources}</p>
                </div>
                <Server className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Unique IPs</p>
                  <p className="text-2xl font-bold text-white">{stats.basicStats.uniqueIps}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Anomaly Metrics */}
      {totalAnomalies > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass border-red-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Anomalies Detected</p>
                  <p className="text-2xl font-bold text-red-400">{totalAnomalies}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Anomaly Types</p>
                  <p className="text-2xl font-bold text-white">
                    {Object.keys(anomalyResult?.summary.anomalyTypes || {}).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Top Source</p>
                  <p className="text-lg font-bold text-white">
                    {Object.keys(anomalyResult?.summary.topSources || {})[0] || 'N/A'}
                  </p>
                </div>
                <Server className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <LogCharts stats={stats} />
      )}

      {/* Recommendations */}
      {stats?.recommendations && stats.recommendations.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Recommended Fixes
            </CardTitle>
            <CardDescription>
              Based on pattern analysis of your logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {stats.recommendations.map((rec, index) => (
                <div key={index} className="p-4 glass rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-300 mb-1">{rec.reason}</h4>
                      <p className="text-slate-300 text-sm mb-2">{rec.advice}</p>
                      {rec.examples && rec.examples.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-400 mb-1">Examples:</p>
                          <ul className="text-xs text-slate-500 space-y-1">
                            {rec.examples.slice(0, 2).map((example, i) => (
                              <li key={i} className="truncate">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {aiRecommendations && (
        <div id="ai-recommendations">
          <AiRecommendationsCard recommendations={aiRecommendations} />
        </div>
      )}

      {/* Log Table */}
      {result && result.sample.length > 0 && (
        <LogTable logs={result.sample} />
      )}

      {/* Anomaly Table */}
      {anomalies.length > 0 && (
        <AnomalyTable anomalies={anomalies} />
      )}

      {/* Detailed Metrics */}
      {stats && (
        <LogMetrics stats={stats} />
      )}
    </div>
  )
}
