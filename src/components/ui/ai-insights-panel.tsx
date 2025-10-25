'use client'

import * as React from "react"
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Shield, Zap, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  type: 'explanation' | 'prediction' | 'recommendation' | 'pattern' | 'anomaly'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  category: 'performance' | 'security' | 'reliability' | 'efficiency' | 'cost'
  evidence: string[]
  reasoning: string
  actionable: boolean
  priority: number
  relatedAlerts?: string[]
  suggestedActions?: string[]
}

interface AIInsightsPanelProps {
  insights: AIInsight[]
  onInsightClick?: (insight: AIInsight) => void
  onActionClick?: (action: string) => void
  className?: string
}

const insightTypeConfig = {
  explanation: { icon: Brain, color: "text-blue-400", bg: "bg-blue-500/20" },
  prediction: { icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/20" },
  recommendation: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  pattern: { icon: Target, color: "text-green-400", bg: "bg-green-500/20" },
  anomaly: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/20" }
}

const categoryConfig = {
  performance: { icon: Zap, color: "text-blue-400" },
  security: { icon: Shield, color: "text-red-400" },
  reliability: { icon: Clock, color: "text-green-400" },
  efficiency: { icon: TrendingUp, color: "text-purple-400" },
  cost: { icon: Target, color: "text-orange-400" }
}

const impactConfig = {
  low: { color: "bg-blue-500", text: "text-blue-200" },
  medium: { color: "bg-yellow-500", text: "text-yellow-200" },
  high: { color: "bg-orange-500", text: "text-orange-200" },
  critical: { color: "bg-red-500", text: "text-red-200" }
}

export function AIInsightsPanel({ 
  insights, 
  onInsightClick, 
  onActionClick, 
  className 
}: AIInsightsPanelProps) {
  const [selectedInsight, setSelectedInsight] = React.useState<AIInsight | null>(null)
  const [filter, setFilter] = React.useState<'all' | 'explanation' | 'prediction' | 'recommendation' | 'pattern' | 'anomaly'>('all')

  const filteredInsights = insights.filter(insight => 
    filter === 'all' || insight.type === filter
  )

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400"
    if (confidence >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "text-red-400"
    if (priority >= 6) return "text-orange-400"
    if (priority >= 4) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white font-outfit">AI Insights</h2>
            <p className="text-slate-400 font-poppins">
              Intelligent analysis and contextual explanations
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Insights</div>
          <div className="text-2xl font-bold text-white">{insights.length}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 glass-premium p-1 rounded-xl">
        {[
          { id: 'all', label: 'All', count: insights.length },
          { id: 'explanation', label: 'Explanations', count: insights.filter(i => i.type === 'explanation').length },
          { id: 'prediction', label: 'Predictions', count: insights.filter(i => i.type === 'prediction').length },
          { id: 'recommendation', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length },
          { id: 'pattern', label: 'Patterns', count: insights.filter(i => i.type === 'pattern').length },
          { id: 'anomaly', label: 'Anomalies', count: insights.filter(i => i.type === 'anomaly').length }
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
              filter === id
                ? "bg-purple-500 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            {label}
            <Badge variant="outline" className="text-xs">
              {count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => {
          const typeConfig = insightTypeConfig[insight.type]
          const categoryInfo = categoryConfig[insight.category]
          const impactInfo = impactConfig[insight.impact]
          const TypeIcon = typeConfig.icon
          const CategoryIcon = categoryInfo.icon

          return (
            <Card
              key={insight.id}
              className={cn(
                "glass-premium transition-all duration-300 hover-soft-lift cursor-pointer",
                selectedInsight?.id === insight.id && "ring-2 ring-purple-500/50"
              )}
              onClick={() => {
                setSelectedInsight(insight)
                onInsightClick?.(insight)
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Insight Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    typeConfig.bg
                  )}>
                    <TypeIcon className={cn("w-6 h-6", typeConfig.color)} />
                  </div>

                  {/* Insight Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white font-outfit">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {insight.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 font-poppins line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <CategoryIcon className="w-3 h-3" />
                        {insight.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Confidence:</span>
                        <span className={cn("font-medium", getConfidenceColor(insight.confidence))}>
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Priority:</span>
                        <span className={cn("font-medium", getPriorityColor(insight.priority))}>
                          {insight.priority}/10
                        </span>
                      </div>
                    </div>

                    {/* Impact Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className={impactInfo.color}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Insight Modal */}
      {selectedInsight && (
        <Card className="glass-modal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  insightTypeConfig[selectedInsight.type].bg
                )}>
                  {React.createElement(insightTypeConfig[selectedInsight.type].icon, {
                    className: cn(
                      "w-5 h-5",
                      insightTypeConfig[selectedInsight.type].color
                    )
                  })}
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedInsight.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {selectedInsight.type.toUpperCase()} • {selectedInsight.category}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInsight(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-white mb-2">Description</h4>
              <p className="text-slate-300 font-poppins">{selectedInsight.description}</p>
            </div>

            {/* Reasoning */}
            <div>
              <h4 className="font-semibold text-white mb-2">AI Reasoning</h4>
              <p className="text-slate-300 font-poppins">{selectedInsight.reasoning}</p>
            </div>

            {/* Evidence */}
            {selectedInsight.evidence.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Supporting Evidence</h4>
                <ul className="space-y-1">
                  {selectedInsight.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Actions */}
            {selectedInsight.suggestedActions && selectedInsight.suggestedActions.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Suggested Actions</h4>
                <div className="space-y-2">
                  {selectedInsight.suggestedActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                      <span className="text-sm text-slate-300">{action}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onActionClick?.(action)}
                        className="hover-soft-scale"
                      >
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs text-slate-400">Confidence</div>
                <div className={cn("font-semibold", getConfidenceColor(selectedInsight.confidence))}>
                  {Math.round(selectedInsight.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Impact</div>
                <Badge className={impactConfig[selectedInsight.impact].color}>
                  {selectedInsight.impact.toUpperCase()}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-slate-400">Priority</div>
                <div className={cn("font-semibold", getPriorityColor(selectedInsight.priority))}>
                  {selectedInsight.priority}/10
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Actionable</div>
                <div className={cn("font-semibold", selectedInsight.actionable ? "text-green-400" : "text-red-400")}>
                  {selectedInsight.actionable ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <Card className="glass-premium">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Insights Found</h3>
            <p className="text-slate-400">No insights match the current filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
