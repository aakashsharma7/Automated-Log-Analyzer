'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogAnalysis } from '@/types'
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Users, 
  Server, 
  Shield,
  TrendingUp,
  Database
} from 'lucide-react'

interface LogMetricsProps {
  stats: LogAnalysis
}

export function LogMetrics({ stats }: LogMetricsProps) {
  const { basicStats, timeAnalysis, errorAnalysis, ipAnalysis, sourceAnalysis, performanceMetrics, securityAnalysis } = stats

  return (
    <div className="space-y-6">
      {/* Time Analysis */}
      {timeAnalysis.logsPerSecond && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Time Analysis
            </CardTitle>
            <CardDescription>Log volume and timing patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {timeAnalysis.logsPerSecond?.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">Logs per second</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {timeAnalysis.logsPerMinute?.toFixed(0)}
                </p>
                <p className="text-sm text-slate-400">Logs per minute</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {timeAnalysis.peakHour !== undefined ? `${timeAnalysis.peakHour}:00` : 'N/A'}
                </p>
                <p className="text-sm text-slate-400">Peak hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Analysis */}
      {errorAnalysis.totalErrors > 0 && (
        <Card className="glass border-red-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Error Analysis
            </CardTitle>
            <CardDescription>Error patterns and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Total Errors</p>
                <p className="text-3xl font-bold text-red-400">{errorAnalysis.totalErrors}</p>
                <p className="text-sm text-slate-500">
                  {errorAnalysis.errorRate?.toFixed(1)}% of all logs
                </p>
              </div>
              {errorAnalysis.topErrorSources && Object.keys(errorAnalysis.topErrorSources).length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Top Error Sources</p>
                  <div className="space-y-1">
                    {Object.entries(errorAnalysis.topErrorSources)
                      .slice(0, 3)
                      .map(([source, count]) => (
                        <div key={source} className="flex justify-between">
                          <span className="text-slate-300">{source}</span>
                          <span className="text-red-400 font-mono">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* IP Analysis */}
      {ipAnalysis.totalUniqueIps && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              IP Analysis
            </CardTitle>
            <CardDescription>IP address patterns and suspicious activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Unique IPs</p>
                <p className="text-3xl font-bold text-white">{ipAnalysis.totalUniqueIps}</p>
                {ipAnalysis.ipDistribution && (
                  <div className="mt-2 space-y-1 text-sm text-slate-400">
                    <p>Single requests: {ipAnalysis.ipDistribution.singleRequest}</p>
                    <p>Multiple requests: {ipAnalysis.ipDistribution.multipleRequests}</p>
                    <p>High volume: {ipAnalysis.ipDistribution.highVolumeIps}</p>
                  </div>
                )}
              </div>
              {ipAnalysis.suspiciousIps && ipAnalysis.suspiciousIps.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Suspicious IPs</p>
                  <div className="space-y-2">
                    {ipAnalysis.suspiciousIps.slice(0, 3).map((ip, index) => (
                      <div key={index} className="p-2 glass rounded border-l-4 border-red-400">
                        <p className="font-mono text-red-400">{ip.ip}</p>
                        <p className="text-xs text-slate-400">Score: {ip.suspiciousScore}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics.responseSize && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Response size and performance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Response Size</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Mean:</span>
                    <span className="text-white font-mono">
                      {(performanceMetrics.responseSize.mean / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">95th percentile:</span>
                    <span className="text-white font-mono">
                      {(performanceMetrics.responseSize.percentile95 / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Max:</span>
                    <span className="text-white font-mono">
                      {(performanceMetrics.responseSize.max / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </div>
              {performanceMetrics.requestMethods && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Request Methods</p>
                  <div className="space-y-1">
                    {Object.entries(performanceMetrics.requestMethods)
                      .slice(0, 5)
                      .map(([method, count]) => (
                        <div key={method} className="flex justify-between">
                          <span className="text-slate-300">{method}</span>
                          <span className="text-white font-mono">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Analysis */}
      {securityAnalysis.potentialThreats > 0 && (
        <Card className="glass border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Shield className="w-5 h-5" />
              Security Analysis
            </CardTitle>
            <CardDescription>Potential security threats and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Potential Threats</p>
                <p className="text-3xl font-bold text-yellow-400">{securityAnalysis.potentialThreats}</p>
                <p className="text-sm text-slate-500">
                  Failed attempts: {securityAnalysis.failedAttempts}
                </p>
              </div>
              {securityAnalysis.suspiciousPatterns.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Suspicious Patterns</p>
                  <div className="space-y-1">
                    {securityAnalysis.suspiciousPatterns.slice(0, 3).map((pattern, index) => (
                      <div key={index} className="p-2 glass rounded border-l-4 border-yellow-400">
                        <p className="text-yellow-300 font-medium">{pattern.pattern}</p>
                        <p className="text-xs text-slate-400">Count: {pattern.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Analysis */}
      {sourceAnalysis.totalSources && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Source Analysis
            </CardTitle>
            <CardDescription>Log sources and their characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Total Sources</p>
                <p className="text-3xl font-bold text-white">{sourceAnalysis.totalSources}</p>
              </div>
              {sourceAnalysis.sourceDetails && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Top Sources</p>
                  <div className="space-y-1">
                    {Object.entries(sourceAnalysis.sourceDetails)
                      .slice(0, 3)
                      .map(([source, details]) => (
                        <div key={source} className="flex justify-between items-center">
                          <span className="text-slate-300">{source}</span>
                          <div className="text-right text-sm">
                            <p className="text-white">{details.logCount} logs</p>
                            <p className="text-slate-400">{details.errorRate.toFixed(1)}% errors</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
