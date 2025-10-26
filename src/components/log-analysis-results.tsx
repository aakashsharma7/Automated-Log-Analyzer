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
      {/* Analysis Summary Header */}
      {stats && (
        <TransitionWrapper animation="fade" delay={100}>
          <Card className="glass-ultra border-blue-500/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-outfit font-bold text-white flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Log Analysis Summary
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Comprehensive insights from your log data
              </CardDescription>
            </CardHeader>
          </Card>
        </TransitionWrapper>
      )}

      {/* Metrics Overview */}
      {stats && (
        <TransitionWrapper animation="fade" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-premium hover-soft-lift hover-glow-soft animate-scale-in-bounce" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Log Entries</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.totalLogs.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Processed successfully</p>
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
                  <p className="text-xs text-slate-500 mt-1">
                    {(stats.basicStats.errorRate || 0) > 5 ? 'High - Needs attention' : 
                     (stats.basicStats.errorRate || 0) > 1 ? 'Moderate - Monitor closely' : 'Low - Healthy'}
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
                  <p className="text-sm font-medium text-slate-400 mb-2">Log Sources</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.uniqueSources}</p>
                  <p className="text-xs text-slate-500 mt-1">Different systems/applications</p>
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
                  <p className="text-sm font-medium text-slate-400 mb-2">Unique IP Addresses</p>
                  <p className="text-3xl font-bold text-white">{stats.basicStats.uniqueIps}</p>
                  <p className="text-xs text-slate-500 mt-1">Different client connections</p>
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

      {/* Detailed Insights */}
      {stats && (
        <TransitionWrapper animation="slide" delay={250}>
          <Card className="glass-ultra">
            <CardHeader>
              <CardTitle className="text-xl font-outfit font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                Key Insights & Patterns
              </CardTitle>
              <CardDescription className="text-slate-300">
                Important findings from your log analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Error Sources */}
                {stats.errorAnalysis?.topErrorSources && stats.errorAnalysis.topErrorSources.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      Top Error Sources
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(stats.errorAnalysis.topErrorSources)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([source, count], index) => (
                        <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                          <span className="text-sm text-slate-300">{source}</span>
                          <Badge variant="destructive" className="text-xs">
                            {count} errors
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Peak Activity Times */}
                {stats.timeAnalysis?.hourlyDistribution && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Peak Activity Hours
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(stats.timeAnalysis.hourlyDistribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([hour, count]) => (
                        <div key={hour} className="flex items-center justify-between p-3 glass-card rounded-lg">
                          <span className="text-sm text-slate-300">{hour}:00 - {parseInt(hour) + 1}:00</span>
                          <Badge variant="outline" className="text-xs">
                            {count} logs
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{stats.basicStats.totalLogs.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Total Entries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{stats.basicStats.uniqueSources}</p>
                    <p className="text-xs text-slate-400">Sources</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">{stats.basicStats.uniqueIps}</p>
                    <p className="text-xs text-slate-400">IP Addresses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{(stats.basicStats.errorRate || 0).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400">Error Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TransitionWrapper>
      )}

      {/* Anomaly Detection Results */}
      {totalAnomalies > 0 && (
        <TransitionWrapper animation="slide" delay={300}>
          <Card className="glass-ultra border-red-500/20 mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-outfit font-bold text-white flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse-glow">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Anomaly Detection Results
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Unusual patterns and potential issues identified
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-left">
          <Card className="glass-premium border-red-400/30 hover-soft-lift hover-pulse-glow animate-scale-in-bounce" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Anomalies</p>
                  <p className="text-3xl font-bold text-red-400">{totalAnomalies}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {totalAnomalies > 10 ? 'High - Immediate attention needed' : 
                     totalAnomalies > 5 ? 'Moderate - Review recommended' : 'Low - Monitor closely'}
                  </p>
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
                  <p className="text-sm font-medium text-slate-400 mb-2">Anomaly Categories</p>
                  <p className="text-3xl font-bold text-white">
                    {Object.keys(anomalyResult?.summary.anomalyTypes || {}).length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Different types of issues</p>
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
                  <p className="text-sm font-medium text-slate-400 mb-2">Most Affected Source</p>
                  <p className="text-lg font-bold text-white">
                    {Object.keys(anomalyResult?.summary.topSources || {})[0] || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Primary source of anomalies</p>
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

      {/* Analysis Summary */}
      <TransitionWrapper animation="fade" delay={400}>
        <Card className="glass-ultra border-green-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-outfit font-bold text-white flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              Analysis Complete
            </CardTitle>
            <CardDescription className="text-slate-300">
              Your log analysis has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 glass-card rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {stats?.basicStats.totalLogs.toLocaleString() || 0}
                </div>
                <div className="text-sm text-slate-400">Logs Analyzed</div>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {totalAnomalies}
                </div>
                <div className="text-sm text-slate-400">Anomalies Found</div>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {stats?.basicStats.uniqueSources || 0}
                </div>
                <div className="text-sm text-slate-400">Sources Monitored</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-slate-300 text-sm">
                {totalAnomalies > 0 
                  ? `Found ${totalAnomalies} anomalies that require attention. Review the detailed analysis above for specific recommendations.`
                  : 'No anomalies detected. Your system appears to be running normally.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </TransitionWrapper>
    </div>
  )
}
