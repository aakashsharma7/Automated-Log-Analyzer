'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AiRecommendations } from '@/types'
import { Brain, AlertCircle, CheckCircle, Shield, Eye, ExternalLink } from 'lucide-react'

interface AiRecommendationsCardProps {
  recommendations: {
    ai_recommendations: AiRecommendations
    context: any
  }
}

export function AiRecommendationsCard({ recommendations }: AiRecommendationsCardProps) {
  const { ai_recommendations } = recommendations

  return (
    <Card className="glass border-amber-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Brain className="w-5 h-5" />
          AI-Powered Recommendations
          <Badge variant="outline" className="text-amber-300 border-amber-400/30">
            {ai_recommendations.confidence} Confidence
          </Badge>
        </CardTitle>
        <CardDescription>
          Intelligent analysis and recommendations based on your log patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Root Cause Analysis */}
        {ai_recommendations.rootCause && (
          <div className="p-4 glass rounded-lg border-l-4 border-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300 mb-2">Root Cause Analysis</h4>
                <p className="text-slate-300">{ai_recommendations.rootCause}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fix Steps */}
        {ai_recommendations.fixSteps && ai_recommendations.fixSteps.length > 0 && (
          <div className="p-4 glass rounded-lg border-l-4 border-green-400">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-300 mb-3">Fix Steps</h4>
                <ol className="space-y-2">
                  {ai_recommendations.fixSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-400/20 text-green-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-slate-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Prevention Strategies */}
        {ai_recommendations.prevention && ai_recommendations.prevention.length > 0 && (
          <div className="p-4 glass rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-300 mb-3">Prevention Strategies</h4>
                <ul className="space-y-1">
                  {ai_recommendations.prevention.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Recommendations */}
        {ai_recommendations.monitoring && ai_recommendations.monitoring.length > 0 && (
          <div className="p-4 glass rounded-lg border-l-4 border-purple-400">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-300 mb-3">Monitoring Recommendations</h4>
                <ul className="space-y-1">
                  {ai_recommendations.monitoring.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* References */}
        {ai_recommendations.references && ai_recommendations.references.length > 0 && (
          <div className="p-4 glass rounded-lg border-l-4 border-cyan-400">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-300 mb-3">References</h4>
                <ul className="space-y-1">
                  {ai_recommendations.references.map((ref, index) => (
                    <li key={index}>
                      <a 
                        href={ref} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline text-sm flex items-center gap-1"
                      >
                        {ref}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
