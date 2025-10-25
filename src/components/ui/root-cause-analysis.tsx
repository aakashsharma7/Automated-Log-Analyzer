'use client'

import * as React from "react"
import { Brain, Search, TrendingUp, AlertTriangle, Clock, Users, Server, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { ProgressBar } from "./progress-bar"
import { cn } from "@/lib/utils"

interface RootCauseAnalysis {
  id: string
  alertId: string
  status: 'analyzing' | 'completed' | 'failed'
  confidence: number
  primaryCause: {
    type: 'system' | 'network' | 'application' | 'database' | 'external' | 'user'
    description: string
    evidence: string[]
    confidence: number
  }
  contributingFactors: Array<{
    type: string
    description: string
    impact: 'low' | 'medium' | 'high'
    confidence: number
  }>
  timeline: Array<{
    timestamp: Date
    event: string
    description: string
    type: 'trigger' | 'escalation' | 'investigation' | 'resolution'
    confidence: number
  }>
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical'
    action: string
    description: string
    estimatedImpact: string
    effort: 'low' | 'medium' | 'high'
  }>
  patterns: Array<{
    pattern: string
    frequency: number
    severity: 'low' | 'medium' | 'high'
    description: string
  }>
  aiInsights: {
    summary: string
    keyFindings: string[]
    suggestedActions: string[]
    riskAssessment: 'low' | 'medium' | 'high' | 'critical'
  }
}

interface RootCauseAnalysisProps {
  analysis: RootCauseAnalysis
  onActionClick?: (action: string) => void
  className?: string
}

const causeTypeConfig = {
  system: { icon: Server, color: "text-red-400", bg: "bg-red-500/20" },
  network: { icon: Zap, color: "text-blue-400", bg: "bg-blue-500/20" },
  application: { icon: Brain, color: "text-purple-400", bg: "bg-purple-500/20" },
  database: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/20" },
  external: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/20" },
  user: { icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/20" }
}

const priorityConfig = {
  low: { color: "bg-blue-500", text: "text-blue-200" },
  medium: { color: "bg-yellow-500", text: "text-yellow-200" },
  high: { color: "bg-orange-500", text: "text-orange-200" },
  critical: { color: "bg-red-500", text: "text-red-200" }
}

export function RootCauseAnalysis({ analysis, onActionClick, className }: RootCauseAnalysisProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'timeline' | 'recommendations' | 'patterns'>('overview')
  const [isAnalyzing, setIsAnalyzing] = React.useState(analysis.status === 'analyzing')

  React.useEffect(() => {
    if (analysis.status === 'analyzing') {
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [analysis.status])

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400"
    if (confidence >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  const primaryCauseConfig = causeTypeConfig[analysis.primaryCause.type]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white font-outfit">Root Cause Analysis</h2>
            <p className="text-slate-400 font-poppins">
              AI-powered investigation and insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {analysis.status.toUpperCase()}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-slate-400">Confidence</div>
            <div className={cn("text-lg font-semibold", getConfidenceColor(analysis.confidence))}>
              {Math.round(analysis.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="glass-premium">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <h3 className="font-semibold text-white">Analyzing Root Cause...</h3>
                <p className="text-sm text-slate-400">AI is investigating the incident</p>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 glass-premium p-1 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Search },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'recommendations', label: 'Actions', icon: TrendingUp },
          { id: 'patterns', label: 'Patterns', icon: Brain }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium",
              activeTab === id
                ? "bg-blue-500 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Primary Cause */}
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", primaryCauseConfig.bg)}>
                    <primaryCauseConfig.icon className={cn("w-4 h-4", primaryCauseConfig.color)} />
                  </div>
                  Primary Root Cause
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 font-poppins">{analysis.primaryCause.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Evidence:</h4>
                  <ul className="space-y-1">
                    {analysis.primaryCause.evidence.map((evidence, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        {evidence}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Confidence:</span>
                  <span className={cn("font-semibold", getConfidenceColor(analysis.primaryCause.confidence))}>
                    {Math.round(analysis.primaryCause.confidence * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contributing Factors */}
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Contributing Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.contributingFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 glass-card rounded-xl">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className={priorityConfig[factor.impact].text}>
                          {factor.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{factor.type}</h4>
                        <p className="text-sm text-slate-300 mb-2">{factor.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Confidence:</span>
                          <span className={cn("text-xs font-medium", getConfidenceColor(factor.confidence))}>
                            {Math.round(factor.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="glass-aurora">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 font-poppins">{analysis.aiInsights.summary}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Findings:</h4>
                    <ul className="space-y-1">
                      {analysis.aiInsights.keyFindings.map((finding, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Suggested Actions:</h4>
                    <ul className="space-y-1">
                      {analysis.aiInsights.suggestedActions.map((action, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Risk Assessment:</span>
                  <Badge className={priorityConfig[analysis.aiInsights.riskAssessment].color}>
                    {analysis.aiInsights.riskAssessment.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Card className="glass-premium">
            <CardHeader>
              <CardTitle>Root Cause Timeline</CardTitle>
              <CardDescription>Chronological sequence of events leading to the incident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.timeline.map((event, index) => (
                  <div key={event.timestamp.getTime()} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm text-white font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white">{event.event}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {getTimeAgo(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{event.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Confidence:</span>
                        <span className={cn("text-xs font-medium", getConfidenceColor(event.confidence))}>
                          {Math.round(event.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <Card key={index} className="glass-premium">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Badge className={priorityConfig[rec.priority].color}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{rec.action}</h4>
                      <p className="text-sm text-slate-300 mb-3">{rec.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Impact: {rec.estimatedImpact}</span>
                        <span>Effort: {rec.effort}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActionClick?.(rec.action)}
                      className="hover-soft-scale"
                    >
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <Card className="glass-premium">
            <CardHeader>
              <CardTitle>Pattern Analysis</CardTitle>
              <CardDescription>Recurring patterns and trends identified by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.patterns.map((pattern, index) => (
                  <div key={index} className="p-4 glass-card rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{pattern.pattern}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={priorityConfig[pattern.severity].text}>
                          {pattern.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-slate-400">
                          {pattern.frequency}x occurrences
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
