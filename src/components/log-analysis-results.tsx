'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogEntry, LogAnalysis, AnomalyDetectionResult, AiRecommendations } from '@/types'
import { LogMetrics } from './log-metrics'
import { LogTable } from './log-table'
import { AnomalyTable } from './anomaly-table'
import { AiRecommendationsCard } from './ai-recommendations-card'
import { LogCharts } from './log-charts'
import { TransitionWrapper, StaggeredTransition } from '@/components/ui/transition-wrapper'
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
    <div className="space-y-8">
      {/* Metrics Overview */}
      {stats && (
        <TransitionWrapper animation="fade" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Logs</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.totalLogs.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-soft-lift hover-pulse-glow animate-scale-in-bounce" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Error Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {(stats.basicStats.errorRate || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Unique Sources</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.uniqueSources}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Unique IPs</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.uniqueIps}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TransitionWrapper>
      )}

      {/* Anomaly Metrics */}
      {totalAnomalies > 0 && (
        <TransitionWrapper animation="slide" delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-left">
          <Card className="glass-premium border-red-400/30 hover-soft-lift hover-pulse-glow animate-scale-in-bounce" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Anomalies Detected</p>
                  <p className="text-3xl font-bold text-red-400">{totalAnomalies}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow hover-soft-scale">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Anomaly Types</p>
                  <p className="text-3xl font-bold text-white">
                    {Object.keys(anomalyResult?.summary.anomalyTypes || {}).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Top Source</p>
                  <p className="text-lg font-bold text-white">
                    {Object.keys(anomalyResult?.summary.topSources || {})[0] || 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg hover-soft-scale">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TransitionWrapper>
      )}

      {/* Charts */}
      {stats && (
        <TransitionWrapper animation="fade" delay={400}>
          <div className="animate-fade-in-up">
            <LogCharts stats={stats} />
          </div>
        </TransitionWrapper>
      )}

      {/* Recommendations */}
      {stats?.recommendations && stats.recommendations.length > 0 && (
        <TransitionWrapper animation="slide" delay={500}>
          <Card className="glass-ultra animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Recommended Fixes
            </CardTitle>
            <CardDescription className="text-lg">
              Based on pattern analysis of your logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {stats.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-6 glass-premium rounded-2xl hover-soft-lift hover-glow-soft animate-scale-in-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover-soft-scale">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-300 mb-2 text-lg">{rec.reason}</h4>
                      <p className="text-slate-300 text-base mb-3 leading-relaxed">{rec.advice}</p>
                      {rec.examples && rec.examples.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-400 mb-2 font-medium">Examples:</p>
                          <ul className="text-sm text-slate-500 space-y-1">
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
        </TransitionWrapper>
      )}

      {/* AI Recommendations */}
      {aiRecommendations && (
        <TransitionWrapper animation="fade" delay={600}>
          <div id="ai-recommendations" className="animate-fade-in-up">
            <AiRecommendationsCard recommendations={aiRecommendations} />
          </div>
        </TransitionWrapper>
      )}

      {/* Log Table */}
      {result && result.sample.length > 0 && (
        <TransitionWrapper animation="slide" delay={700}>
          <div className="animate-slide-in-left">
            <LogTable logs={result.sample} />
          </div>
        </TransitionWrapper>
      )}

      {/* Anomaly Table */}
      {anomalies.length > 0 && (
        <TransitionWrapper animation="slide" delay={800}>
          <div className="animate-slide-in-right">
            <AnomalyTable anomalies={anomalies} />
          </div>
        </TransitionWrapper>
      )}

      {/* Detailed Metrics */}
      {stats && (
        <TransitionWrapper animation="fade" delay={900}>
          <div className="animate-fade-in-up">
            <LogMetrics stats={stats} />
          </div>
        </TransitionWrapper>
      )}
    </div>
  )
}
