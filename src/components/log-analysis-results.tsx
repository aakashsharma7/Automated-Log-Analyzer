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
import { memo } from 'react'
import { 
  ProgressiveDisclosure, 
  CollapsibleSection, 
  SummaryCard, 
  ExpandableDetails, 
  ProgressiveTabs,
  VisibilityToggle 
} from '@/components/ui/progressive-disclosure'
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  TrendingUp, 
  Users, 
  Server,
  Clock,
  Shield,
  MoreHorizontal
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

export const LogAnalysisResults = memo(function LogAnalysisResults({ 
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

      {/* Metrics Overview - Progressive Disclosure */}
      {stats && (
        <TransitionWrapper animation="fade" delay={200}>
          <ProgressiveDisclosure
            title="Key Metrics Overview"
            description="Essential metrics at a glance. Click to expand for detailed breakdowns."
            level="basic"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Total Log Entries"
                value={stats.basicStats.totalLogs.toLocaleString()}
                description="Processed successfully"
                trend="neutral"
                level="basic"
              />
              
              <SummaryCard
                title="Error Rate"
                value={`${(stats.basicStats.errorRate || 0).toFixed(1)}%`}
                description={
                  (stats.basicStats.errorRate || 0) > 5 ? 'High - Needs attention' : 
                  (stats.basicStats.errorRate || 0) > 1 ? 'Moderate - Monitor closely' : 'Low - Healthy'
                }
                trend={(stats.basicStats.errorRate || 0) > 5 ? 'up' : 'down'}
                level="basic"
              />
              
              <SummaryCard
                title="Log Sources"
                value={stats.basicStats.uniqueSources}
                description="Different systems/applications"
                trend="neutral"
                level="basic"
              />
              
              <SummaryCard
                title="Unique IP Addresses"
                value={stats.basicStats.uniqueIps}
                description="Different client connections"
                trend="neutral"
                level="basic"
              />
            </div>
          </ProgressiveDisclosure>
        </TransitionWrapper>
      )}

      {/* Detailed Insights - Progressive Disclosure */}
      {stats && (
        <TransitionWrapper animation="slide" delay={250}>
          <div className="space-y-4">
            <CollapsibleSection
              title="Error Analysis"
              level="intermediate"
              icon={AlertTriangle}
              defaultExpanded={false}
            >
              <div className="space-y-4">
                {stats.errorAnalysis?.topErrorSources && Object.keys(stats.errorAnalysis.topErrorSources).length > 0 && (
                  <ExpandableDetails
                    summary={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Top Error Sources</span>
                        <Badge variant="destructive" className="text-xs">
                          {Object.keys(stats.errorAnalysis.topErrorSources).length} sources
                        </Badge>
                      </div>
                    }
                    details={
                      <div className="space-y-2">
                        {Object.entries(stats.errorAnalysis.topErrorSources)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([source, count], index) => (
                          <div key={index} className="flex items-center justify-between p-2 glass-card rounded-lg">
                            <span className="text-sm text-slate-300">{source}</span>
                            <Badge variant="destructive" className="text-xs">
                              {count} errors
                            </Badge>
                          </div>
                        ))}
                      </div>
                    }
                    level="intermediate"
                  />
                )}
                
                {stats.errorAnalysis?.commonErrorPatterns && stats.errorAnalysis.commonErrorPatterns.length > 0 && (
                  <ExpandableDetails
                    summary={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Common Error Patterns</span>
                        <Badge variant="outline" className="text-xs">
                          {stats.errorAnalysis.commonErrorPatterns.length} patterns
                        </Badge>
                      </div>
                    }
                    details={
                      <div className="space-y-2">
                        {stats.errorAnalysis.commonErrorPatterns.slice(0, 3).map((pattern, index) => (
                          <div key={index} className="p-2 glass-card rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-white">{pattern.pattern}</span>
                              <Badge variant="outline" className="text-xs">
                                {pattern.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400">{pattern.count} occurrences</p>
                          </div>
                        ))}
                      </div>
                    }
                    level="advanced"
                  />
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Time Patterns"
              level="intermediate"
              icon={Clock}
              defaultExpanded={false}
            >
              <div className="space-y-4">
                {stats.timeAnalysis?.hourlyDistribution && (
                  <ExpandableDetails
                    summary={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Peak Activity Hours</span>
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(stats.timeAnalysis.hourlyDistribution).length} hours
                        </Badge>
                      </div>
                    }
                    details={
                      <div className="space-y-2">
                        {Object.entries(stats.timeAnalysis.hourlyDistribution)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([hour, count]) => (
                          <div key={hour} className="flex items-center justify-between p-2 glass-card rounded-lg">
                            <span className="text-sm text-slate-300">{hour}:00 - {parseInt(hour) + 1}:00</span>
                            <Badge variant="outline" className="text-xs">
                              {count} logs
                            </Badge>
                          </div>
                        ))}
                      </div>
                    }
                    level="intermediate"
                  />
                )}

                {stats.timeAnalysis?.peakHour !== undefined && (
                  <div className="p-3 glass-card rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">Peak Hour</span>
                      <Badge variant="outline" className="text-xs">
                        {stats.timeAnalysis.peakHour}:00
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Highest activity period
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Performance Metrics"
              level="advanced"
              icon={TrendingUp}
              defaultExpanded={false}
            >
              <div className="space-y-4">
                {stats.performanceMetrics?.responseSize && (
                  <ExpandableDetails
                    summary={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Response Size Statistics</span>
                        <Badge variant="outline" className="text-xs">
                          Detailed
                        </Badge>
                      </div>
                    }
                    details={
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-400">
                            {Math.round(stats.performanceMetrics.responseSize.mean).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">Mean (bytes)</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-400">
                            {Math.round(stats.performanceMetrics.responseSize.median).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">Median (bytes)</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-400">
                            {Math.round(stats.performanceMetrics.responseSize.percentile95).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">95th Percentile</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-400">
                            {Math.round(stats.performanceMetrics.responseSize.max).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">Max (bytes)</p>
                        </div>
                      </div>
                    }
                    level="advanced"
                  />
                )}
              </div>
            </CollapsibleSection>
          </div>
        </TransitionWrapper>
      )}

      {/* Anomaly Detection Results - Progressive Disclosure */}
      {totalAnomalies > 0 && (
        <TransitionWrapper animation="slide" delay={300}>
          <CollapsibleSection
            title="Anomaly Detection Results"
            level="intermediate"
            icon={AlertTriangle}
            defaultExpanded={true}
            className="border-red-500/20"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                  title="Total Anomalies"
                  value={totalAnomalies}
                  description={
                    totalAnomalies > 10 ? 'High - Immediate attention needed' : 
                    totalAnomalies > 5 ? 'Moderate - Review recommended' : 'Low - Monitor closely'
                  }
                  trend={totalAnomalies > 10 ? 'up' : 'down'}
                  level="intermediate"
                />
                
                <SummaryCard
                  title="Anomaly Categories"
                  value={Object.keys(anomalyResult?.summary.anomalyTypes || {}).length}
                  description="Different types of issues"
                  trend="neutral"
                  level="intermediate"
                />
                
                <SummaryCard
                  title="Most Affected Source"
                  value={Object.keys(anomalyResult?.summary.topSources || {})[0] || 'N/A'}
                  description="Primary source of anomalies"
                  trend="neutral"
                  level="intermediate"
                />
              </div>

              {anomalyResult?.summary.anomalyTypes && Object.keys(anomalyResult.summary.anomalyTypes).length > 0 && (
                <ExpandableDetails
                  summary={
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">Anomaly Type Breakdown</span>
                      <Badge variant="destructive" className="text-xs">
                        {Object.keys(anomalyResult.summary.anomalyTypes).length} types
                      </Badge>
                    </div>
                  }
                  details={
                    <div className="space-y-2">
                      {Object.entries(anomalyResult.summary.anomalyTypes)
                        .sort(([,a], [,b]) => b - a)
                        .map(([type, count], index) => (
                        <div key={index} className="flex items-center justify-between p-2 glass-card rounded-lg">
                          <span className="text-sm text-slate-300 capitalize">{type.replace(/_/g, ' ')}</span>
                          <Badge variant="destructive" className="text-xs">
                            {count} occurrences
                          </Badge>
                        </div>
                      ))}
                    </div>
                  }
                  level="advanced"
                />
              )}
            </div>
          </CollapsibleSection>
        </TransitionWrapper>
      )}

      {/* Charts - Progressive Disclosure */}
      {stats && (
        <TransitionWrapper animation="fade" delay={400}>
          <CollapsibleSection
            title="Visual Analytics"
            level="intermediate"
            icon={TrendingUp}
            defaultExpanded={false}
          >
            <VisibilityToggle
              title="Charts and Graphs"
              defaultVisible={true}
              level="intermediate"
            >
              <LogCharts stats={stats} />
            </VisibilityToggle>
          </CollapsibleSection>
        </TransitionWrapper>
      )}

      {/* Recommendations - Progressive Disclosure */}
      {stats?.recommendations && stats.recommendations.length > 0 && (
        <TransitionWrapper animation="slide" delay={500}>
          <CollapsibleSection
            title="Recommended Fixes"
            level="basic"
            icon={Shield}
            defaultExpanded={true}
          >
            <div className="space-y-4">
              {stats.recommendations.map((rec, index) => (
                <ExpandableDetails
                  key={index}
                  summary={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-semibold text-blue-300">{rec.reason}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {rec.count} occurrences
                      </Badge>
                    </div>
                  }
                  details={
                    <div className="space-y-3">
                      <p className="text-slate-300 leading-relaxed">{rec.advice}</p>
                      {rec.examples && rec.examples.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-400 mb-2 font-medium">Examples:</p>
                          <ul className="text-sm text-slate-500 space-y-1">
                            {rec.examples.slice(0, 3).map((example, i) => (
                              <li key={i} className="truncate">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  }
                  level="basic"
                />
              ))}
            </div>
          </CollapsibleSection>
        </TransitionWrapper>
      )}

      {/* AI Recommendations - Progressive Disclosure */}
      {aiRecommendations && (
        <TransitionWrapper animation="fade" delay={600}>
          <CollapsibleSection
            title="AI-Powered Insights"
            level="advanced"
            icon={Brain}
            defaultExpanded={false}
          >
            <div id="ai-recommendations" className="animate-fade-in-up">
              <AiRecommendationsCard recommendations={aiRecommendations} />
            </div>
          </CollapsibleSection>
        </TransitionWrapper>
      )}

      {/* Data Tables - Progressive Disclosure */}
      <TransitionWrapper animation="slide" delay={700}>
        <CollapsibleSection
          title="Raw Data Tables"
          level="advanced"
          icon={MoreHorizontal}
          defaultExpanded={false}
        >
          <div className="space-y-6">
            {result && result.sample.length > 0 && (
              <VisibilityToggle
                title="Log Entries Table"
                defaultVisible={false}
                level="advanced"
              >
                <LogTable logs={result.sample} />
              </VisibilityToggle>
            )}

            {anomalies.length > 0 && (
              <VisibilityToggle
                title="Anomaly Detection Table"
                defaultVisible={false}
                level="advanced"
              >
                <AnomalyTable anomalies={anomalies} />
              </VisibilityToggle>
            )}

            {stats && (
              <VisibilityToggle
                title="Detailed Metrics"
                defaultVisible={false}
                level="advanced"
              >
                <LogMetrics stats={stats} />
              </VisibilityToggle>
            )}
          </div>
        </CollapsibleSection>
      </TransitionWrapper>

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
})
