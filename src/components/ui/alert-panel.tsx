'use client'

import * as React from "react"
import { AlertTriangle, Clock, TrendingUp, Users, Server, Zap, Shield, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'performance' | 'security' | 'error' | 'anomaly' | 'capacity'
  title: string
  description: string
  timestamp: Date
  source: string
  impact: string
  confidence: number
  rootCause?: string
  recommendations?: string[]
  timeline?: TimelineEvent[]
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
}

interface TimelineEvent {
  id: string
  timestamp: Date
  event: string
  description: string
  type: 'trigger' | 'escalation' | 'investigation' | 'resolution'
  confidence: number
}

interface AlertPanelProps {
  alerts: Alert[]
  onAlertClick?: (alert: Alert) => void
  onDismiss?: (alertId: string) => void
  className?: string
}

const severityConfig = {
  low: {
    color: "bg-blue-500/20 border-blue-500/30 text-blue-200",
    icon: Activity,
    badge: "bg-blue-500"
  },
  medium: {
    color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
    icon: TrendingUp,
    badge: "bg-yellow-500"
  },
  high: {
    color: "bg-orange-500/20 border-orange-500/30 text-orange-200",
    icon: AlertTriangle,
    badge: "bg-orange-500"
  },
  critical: {
    color: "bg-red-500/20 border-red-500/30 text-red-200",
    icon: Shield,
    badge: "bg-red-500"
  }
}

const typeConfig = {
  performance: { icon: Zap, color: "text-blue-400" },
  security: { icon: Shield, color: "text-red-400" },
  error: { icon: AlertTriangle, color: "text-orange-400" },
  anomaly: { icon: TrendingUp, color: "text-purple-400" },
  capacity: { icon: Server, color: "text-green-400" }
}

export function AlertPanel({ alerts, onAlertClick, onDismiss, className }: AlertPanelProps) {
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null)
  const [expandedAlerts, setExpandedAlerts] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
  }

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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white font-outfit">Proactive Alerts</h2>
            <p className="text-sm text-slate-400 font-poppins">
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Badge variant="destructive" className="animate-pulse">
          {alerts.filter(a => a.severity === 'critical').length} Critical
        </Badge>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const severity = severityConfig[alert.severity]
          const type = typeConfig[alert.type]
          const isExpanded = expandedAlerts.has(alert.id)
          const SeverityIcon = severity.icon
          const TypeIcon = type.icon

          return (
            <Card
              key={alert.id}
              className={cn(
                "glass-notification border transition-all duration-300 hover-soft-lift cursor-pointer",
                severity.color,
                isExpanded && "ring-2 ring-white/20"
              )}
              onClick={() => {
                toggleExpanded(alert.id)
                onAlertClick?.(alert)
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Alert Icon */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      severity.badge
                    )}>
                      <SeverityIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <TypeIcon className={cn("w-4 h-4", type.color)} />
                          <h3 className="font-semibold text-white font-outfit">{alert.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 font-poppins mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(alert.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            {alert.source}
                          </span>
                          <span className={cn("flex items-center gap-1", getConfidenceColor(alert.confidence))}>
                            <TrendingUp className="w-3 h-3" />
                            {Math.round(alert.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDismiss?.(alert.id)
                          }}
                          className="text-slate-400 hover:text-white hover-soft-scale"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                        {/* Impact & Root Cause */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Impact</h4>
                            <p className="text-sm text-slate-300">{alert.impact}</p>
                          </div>
                          {alert.rootCause && (
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-2">Root Cause</h4>
                              <p className="text-sm text-slate-300">{alert.rootCause}</p>
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        {alert.recommendations && alert.recommendations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                              {alert.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Timeline */}
                        {alert.timeline && alert.timeline.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">Root Cause Timeline</h4>
                            <div className="space-y-3">
                              {alert.timeline.map((event, index) => (
                                <div key={event.id} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-white">{event.event}</span>
                                      <span className="text-xs text-slate-400">
                                        {getTimeAgo(event.timestamp)}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {event.type}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-300">{event.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-slate-400">Confidence:</span>
                                      <span className={cn("text-xs font-medium", getConfidenceColor(event.confidence))}>
                                        {Math.round(event.confidence * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {alerts.length === 0 && (
        <Card className="glass-premium">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-slate-400">No active alerts at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
