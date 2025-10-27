'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogAnalysisResults } from '@/components/log-analysis-results'
import { Upload, FileText, Brain, AlertTriangle, BarChart3, Sparkles, Zap, Search, Command } from 'lucide-react'
import { LogEntry, LogAnalysis, AnomalyDetectionResult, AiRecommendations } from '@/types'
import { LoadingSpinner, PulseLoader } from '@/components/ui/loading-spinner'
import { AnimatedTooltip } from '@/components/ui/tooltip'
import { ModeTransition, TransitionWrapper } from '@/components/ui/transition-wrapper'
import { AlertPanel } from '@/components/ui/alert-panel'
import { RootCauseAnalysis } from '@/components/ui/root-cause-analysis'
import { AIInsightsPanel } from '@/components/ui/ai-insights-panel'
import { useCommandPaletteContext } from '@/components/ui/command-palette-provider'

export function LogAnalyzer() {
  const { openCommandPalette, setCustomCommands } = useCommandPaletteContext()
  const [mode, setMode] = useState<'parse' | 'anomaly'>('parse')
  
  const [files, setFiles] = useState<File[]>([])
  const [content, setContent] = useState('')
  const [format, setFormat] = useState('auto')
  const [contamination, setContamination] = useState(0.1)
  const [threshold, setThreshold] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    rows: number
    columns: string[]
    sample: LogEntry[]
    stats: LogAnalysis
  } | null>(null)
  const [anomalyResult, setAnomalyResult] = useState<AnomalyDetectionResult | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<{
    ai_recommendations: AiRecommendations
    context: any
  } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState<any | null>(null)
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [showProactiveFeatures, setShowProactiveFeatures] = useState(false)

  // Custom commands for the log analyzer - memoized to prevent unnecessary re-renders
  const customCommands = useMemo(() => [
    {
      id: 'switch-to-parse-mode',
      title: 'Switch to Parse Mode',
      description: 'Change to log parsing and analysis mode',
      category: 'analysis' as const,
      icon: FileText,
      keywords: ['parse', 'mode', 'switch', 'analysis'],
      action: () => setMode('parse'),
      shortcut: 'Ctrl+1'
    },
    {
      id: 'switch-to-anomaly-mode',
      title: 'Switch to Anomaly Detection',
      description: 'Change to anomaly detection mode',
      category: 'analysis' as const,
      icon: AlertTriangle,
      keywords: ['anomaly', 'mode', 'switch', 'detection'],
      action: () => setMode('anomaly'),
      shortcut: 'Ctrl+2'
    },
    {
      id: 'run-analysis',
      title: 'Run Analysis',
      description: 'Execute the current analysis with uploaded files',
      category: 'actions' as const,
      icon: Zap,
      keywords: ['run', 'execute', 'analyze', 'start'],
      action: () => {
        if (mode === 'parse') {
          handleSubmit(new Event('submit') as any)
        } else {
          handleSubmit(new Event('submit') as any)
        }
      },
      shortcut: 'Ctrl+Enter'
    },
    {
      id: 'clear-files',
      title: 'Clear Uploaded Files',
      description: 'Remove all uploaded files',
      category: 'actions' as const,
      icon: Upload,
      keywords: ['clear', 'remove', 'files', 'reset'],
      action: () => setFiles([])
    },
    {
      id: 'toggle-proactive-features',
      title: 'Toggle Proactive Features',
      description: 'Show/hide AI insights and proactive alerts',
      category: 'settings' as const,
      icon: Brain,
      keywords: ['proactive', 'features', 'toggle', 'ai'],
      action: () => setShowProactiveFeatures(!showProactiveFeatures)
    }
  ], [mode, showProactiveFeatures])

  // Update custom commands when component mounts or state changes
  React.useEffect(() => {
    setCustomCommands(customCommands)
  }, [setCustomCommands, customCommands])




  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.log', '.txt'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    multiple: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setAnomalyResult(null)
    setAiRecommendations(null)

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (content.trim()) formData.append('content', content)

    try {
      let url = '/api/parse'
      if (mode === 'parse') {
        formData.append('format', format)
      } else {
        url = '/api/anomalies'
        formData.append('contamination', contamination.toString())
        formData.append('threshold', threshold)
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      if (mode === 'parse') {
        setResult(data)
      } else {
        setAnomalyResult(data)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setResult({ 
        rows: 0, 
        columns: [], 
        sample: [], 
        stats: {
          basicStats: { totalLogs: 0, uniqueSources: 0, uniqueIps: 0, dateRange: { start: null, end: null } },
          timeAnalysis: {},
          errorAnalysis: { totalErrors: 0 },
          ipAnalysis: {},
          sourceAnalysis: {},
          performanceMetrics: {},
          securityAnalysis: { potentialThreats: 0, suspiciousPatterns: [], failedAttempts: 0 },
          recommendations: [],
          processedAt: new Date().toISOString()
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const generateProactiveInsights = (analysisData: any) => {
    // Generate mock proactive alerts based on analysis
    const mockAlerts = [
      {
        id: '1',
        severity: 'high' as const,
        type: 'performance' as const,
        title: 'High Error Rate Detected',
        description: 'Error rate has increased by 150% in the last hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        source: 'Web Server',
        impact: 'User experience degradation, potential revenue loss',
        confidence: 0.85,
        rootCause: 'Database connection pool exhaustion due to slow queries',
        recommendations: [
          'Increase database connection pool size',
          'Optimize slow queries identified in logs',
          'Implement query caching'
        ],
        timeline: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            event: 'Initial Error Spike',
            description: 'Error rate began increasing gradually',
            type: 'trigger' as const,
            confidence: 0.7
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 35 * 60 * 1000),
            event: 'Database Pool Exhaustion',
            description: 'Connection pool reached maximum capacity',
            type: 'escalation' as const,
            confidence: 0.9
          }
        ],
        status: 'active' as const
      },
      {
        id: '2',
        severity: 'medium' as const,
        type: 'anomaly' as const,
        title: 'Unusual Traffic Pattern',
        description: 'Traffic spike detected from new geographic region',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        source: 'Load Balancer',
        impact: 'Potential DDoS attack or legitimate traffic surge',
        confidence: 0.65,
        recommendations: [
          'Monitor traffic patterns closely',
          'Implement rate limiting if needed',
          'Verify traffic source legitimacy'
        ],
        status: 'investigating' as const
      }
    ]

    const mockRootCauseAnalysis = {
      id: 'rca-1',
      alertId: '1',
      status: 'completed' as const,
      confidence: 0.88,
      primaryCause: {
        type: 'database' as const,
        description: 'Database connection pool exhaustion caused by inefficient queries',
        evidence: [
          'Connection pool metrics show 100% utilization',
          'Query execution times increased by 300%',
          'Error logs show "connection timeout" messages'
        ],
        confidence: 0.9
      },
      contributingFactors: [
        {
          type: 'Slow Query',
          description: 'Unoptimized SELECT query with missing indexes',
          impact: 'high' as const,
          confidence: 0.85
        },
        {
          type: 'High Load',
          description: 'Increased user traffic during peak hours',
          impact: 'medium' as const,
          confidence: 0.7
        }
      ],
      timeline: [
        {
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          event: 'Normal Operation',
          description: 'System operating within normal parameters',
          type: 'trigger' as const,
          confidence: 1.0
        },
        {
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          event: 'Traffic Increase',
          description: 'User traffic began increasing beyond normal levels',
          type: 'escalation' as const,
          confidence: 0.8
        },
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          event: 'Connection Pool Exhaustion',
          description: 'Database connection pool reached maximum capacity',
          type: 'investigation' as const,
          confidence: 0.95
        }
      ],
      recommendations: [
        {
          priority: 'critical' as const,
          action: 'Optimize Database Queries',
          description: 'Add missing indexes and optimize slow queries',
          estimatedImpact: 'Reduce query time by 70%',
          effort: 'medium' as const
        },
        {
          priority: 'high' as const,
          action: 'Increase Connection Pool',
          description: 'Scale up database connection pool size',
          estimatedImpact: 'Handle 50% more concurrent connections',
          effort: 'low' as const
        }
      ],
      patterns: [
        {
          pattern: 'Peak Hour Load',
          frequency: 5,
          severity: 'medium' as const,
          description: 'Similar incidents occur during peak business hours'
        }
      ],
      aiInsights: {
        summary: 'The root cause is a combination of increased traffic load and inefficient database queries causing connection pool exhaustion.',
        keyFindings: [
          'Database queries lack proper indexing',
          'Connection pool size is insufficient for peak loads',
          'No query caching mechanism in place'
        ],
        suggestedActions: [
          'Implement database query optimization',
          'Add connection pooling configuration',
          'Set up query result caching'
        ],
        riskAssessment: 'high' as const
      }
    }

    const mockAIInsights = [
      {
        id: 'insight-1',
        type: 'explanation' as const,
        title: 'Why Errors Increased',
        description: 'The error spike is directly correlated with database connection timeouts during peak traffic hours.',
        confidence: 0.92,
        impact: 'high' as const,
        category: 'performance' as const,
        evidence: [
          'Error logs show 95% of errors are connection timeouts',
          'Database metrics indicate 100% connection pool utilization',
          'Timing correlation with traffic spike'
        ],
        reasoning: 'AI analysis of log patterns and system metrics reveals a clear causal relationship between traffic increase and database connection exhaustion.',
        actionable: true,
        priority: 9,
        suggestedActions: [
          'Scale database connection pool',
          'Implement query optimization',
          'Add connection retry logic'
        ]
      },
      {
        id: 'insight-2',
        type: 'prediction' as const,
        title: 'Future Risk Assessment',
        description: 'Similar incidents likely to occur during next peak hour without intervention.',
        confidence: 0.78,
        impact: 'medium' as const,
        category: 'reliability' as const,
        evidence: [
          'Historical pattern shows recurring issues during peak hours',
          'Current system capacity insufficient for projected growth',
          'No preventive measures in place'
        ],
        reasoning: 'Pattern analysis indicates this is a recurring issue that will likely repeat without system improvements.',
        actionable: true,
        priority: 7,
        suggestedActions: [
          'Implement proactive monitoring',
          'Set up automated scaling',
          'Create incident response plan'
        ]
      }
    ]

    setAlerts(mockAlerts)
    setRootCauseAnalysis(mockRootCauseAnalysis)
    setAiInsights(mockAIInsights)
    setShowProactiveFeatures(true)
  }

  const handleAiAnalysis = async () => {
    if (!result || result.rows === 0) return

    setAiLoading(true)
    setAiRecommendations(null)

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (content.trim()) formData.append('content', content)
    formData.append('format', format)

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI analysis failed')
      }

      setAiRecommendations(data)

      // Generate proactive insights after AI analysis
      generateProactiveInsights(data)

      // Scroll to AI recommendations
      setTimeout(() => {
        const aiSection = document.getElementById('ai-recommendations')
        if (aiSection) {
          aiSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 100)
    } catch (error) {
      console.error('AI analysis failed:', error)
      setAiRecommendations({ 
        ai_recommendations: {
          rootCause: 'AI analysis failed',
          fixSteps: [],
          prevention: [],
          monitoring: [],
          references: [],
          confidence: 'Low'
        },
        context: {}
      })
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-8 sm:mb-12 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
          {/* Empty div for spacing - hidden on mobile */}
          <div className="hidden sm:flex flex-1"></div>
          
          {/* Centered Heading */}
          <div className="flex-1 flex justify-center order-2 sm:order-1">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-outfit font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient-shift tracking-tight hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-1000 ease-in-out">
                AUTOMATED LOG ANALYZER
              </h1>
            </div>
          </div>
          
          {/* Command Palette Trigger - Right Aligned */}
          <div className="flex justify-end order-1 sm:order-2 sm:flex-1">
            <AnimatedTooltip content="Open command palette (Ctrl+K)">
              <Button
                variant="glass"
                size="lg"
                onClick={openCommandPalette}
                className="flex items-center gap-2 hover-soft-scale hover-glow-soft"
                data-tour="command-palette-btn"
              >
                <Command className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </AnimatedTooltip>
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 font-poppins text-center px-4">
          Transform your log data into actionable insights with our 
          <span className="text-blue-400 font-semibold mx-1">AI-powered analysis</span> and 
          <span className="text-purple-400 font-semibold mx-1">intelligent anomaly detection</span>
        </p>
        <div className="flex justify-center gap-6">
          <AnimatedTooltip content="Process logs in real-time with instant results">
            <div className="flex items-center gap-3 px-6 py-3 glass-premium rounded-2xl hover-soft-scale hover-glow-soft cursor-pointer">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-glow"></div>
              <span className="text-sm text-slate-200 font-medium">Real-time Analysis</span>
            </div>
          </AnimatedTooltip>
          {/* <AnimatedTooltip content="Advanced machine learning algorithms for deep insights">
            <div className="flex items-center gap-3 px-6 py-3 glass-premium rounded-2xl hover-soft-scale hover-glow-soft cursor-pointer">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-sm text-slate-200 font-medium">AI-Powered</span>
            </div>
          </AnimatedTooltip> */}
          {/* <AnimatedTooltip content="Enterprise-grade security and scalability">
            <div className="flex items-center gap-3 px-6 py-3 glass-premium rounded-2xl hover-soft-scale hover-glow-soft cursor-pointer">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse-glow"></div>
              <span className="text-sm text-slate-200 font-medium">Enterprise Ready</span>
            </div>
          </AnimatedTooltip> */}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6 sm:mb-8 animate-slide-in-right px-2">
        <div className="glass-ultra p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-2xl" data-tour="mode-toggle">
          <Button
            variant={mode === 'parse' ? 'success' : 'ghost'}
            onClick={() => setMode('parse')}
            className="rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-4 transition-all duration-300 font-semibold text-xs sm:text-base"
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            <span className="hidden xs:inline">Parse </span>Logs
          </Button>
          <Button
            variant={mode === 'anomaly' ? 'warning' : 'ghost'}
            onClick={() => setMode('anomaly')}
            className="rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-4 transition-all duration-300 font-semibold text-xs sm:text-base"
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            <span className="hidden xs:inline">Detect </span>Anomalies
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <TransitionWrapper animation="fade" delay={200}>
        <Card className="glass-ultra mb-6 sm:mb-8 hover-lift animate-scale-in-bounce">
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-outfit">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg animate-gradient-shift transition-all duration-500 ${
                mode === 'parse' 
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600' 
                  : 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600'
              }`}>
                {mode === 'parse' ? (
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              <div>
                <ModeTransition isActive={mode === 'parse'}>
                  <div className="text-slate-100 font-bold text-lg sm:text-xl">
                    Log Parsing <span className="hidden sm:inline">& Analysis</span>
                  </div>
                </ModeTransition>
                <ModeTransition isActive={mode === 'anomaly'}>
                  <div className="text-slate-100 font-bold text-lg sm:text-xl">
                    Anomaly Detection
                  </div>
                </ModeTransition>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm sm:text-base leading-relaxed font-poppins mt-2">
              {mode === 'parse' 
                ? 'Upload log files or paste content to analyze patterns, extract metrics, and get comprehensive insights'
                : 'Detect unusual patterns, anomalies, and potential security issues in your logs'
              }
            </CardDescription>
          </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <TransitionWrapper animation="slide" delay={300}>
              <div className="space-y-4">
                <Label className="text-slate-200 font-semibold text-lg">Upload Files (optional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 hover-soft-lift hover-border-glow ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-500/10 shadow-2xl scale-105' 
                    : 'border-slate-600 hover:border-blue-400 hover:bg-blue-500/5 hover:shadow-xl'
                }`}
                data-tour="file-upload"
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl animate-gradient-shift">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                {isDragActive ? (
                  <div className="animate-bounce-in">
                    <p className="text-blue-300 text-xl font-semibold mb-2">Drop the files here...</p>
                    <p className="text-blue-400 text-sm">Release to upload</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-200 text-xl font-semibold mb-3">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-slate-400 text-base">
                      Supports .log, .txt, .json, .csv files up to 10MB each
                    </p>
                  </div>
                )}
              </div>
              {files.length > 0 && (
                <div className="mt-6 p-6 glass-premium rounded-2xl animate-slide-up">
                  <p className="text-slate-200 mb-4 font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Selected files ({files.length})
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {files.map((file, index) => (
                      <span
                        key={index}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl text-sm text-slate-200 font-medium hover-soft-scale hover-glow-soft transition-all duration-300 hover:shadow-lg animate-scale-in-bounce"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </TransitionWrapper>

            {/* Content Input */}
            <TransitionWrapper animation="slide" delay={400}>
              <div className="space-y-3">
                <Label className="text-slate-200 font-semibold text-lg">Paste Content (optional)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your log content here for analysis..."
                className="min-h-[150px] text-base"
              />
            </div>
            </TransitionWrapper>

            {/* Format Selection (for parse mode) */}
            {mode === 'parse' && (
              <TransitionWrapper animation="slide" delay={500}>
                <div className="space-y-3">
                  <Label className="text-slate-200 font-semibold text-lg">Log Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select log format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">🔍 Auto-detect</SelectItem>
                    <SelectItem value="apache">🌐 Apache</SelectItem>
                    <SelectItem value="nginx">⚡ Nginx</SelectItem>
                    <SelectItem value="syslog">📋 Syslog</SelectItem>
                    <SelectItem value="json">📄 JSON</SelectItem>
                    <SelectItem value="custom">⚙️ Custom</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </TransitionWrapper>
            )}

            {/* Anomaly Detection Parameters */}
            {mode === 'anomaly' && (
              <TransitionWrapper animation="slide" delay={500}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-200 font-semibold text-lg">Contamination</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="0.5"
                    value={contamination}
                    onChange={(e) => setContamination(parseFloat(e.target.value))}
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-slate-400">
                    Expected proportion of anomalies (0.01-0.5)
                  </p>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-200 font-semibold text-lg">Threshold (optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="Custom threshold"
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-slate-400">
                    Custom anomaly score threshold
                  </p>
                </div>
              </div>
              </TransitionWrapper>
            )}

            {/* Submit Button */}
            <TransitionWrapper animation="slide" delay={600}>
              <div className="flex gap-6 pt-6">
              <Button
                type="submit"
                disabled={loading}
                variant={mode === 'parse' ? 'premium' : 'destructive'}
                size="xl"
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" variant="default" className="mr-3" />
                    {mode === 'parse' ? 'Analyzing...' : 'Detecting...'}
                  </>
                ) : (
                  <>
                    {mode === 'parse' ? (
                      <>
                        <FileText className="w-6 h-6 mr-3" />
                        Parse & Analyze
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-6 h-6 mr-3" />
                        Detect Anomalies
                      </>
                    )}
                  </>
                )}
              </Button>

              {/* AI Analysis Button */}
              {result && result.rows > 0 && mode === 'parse' && (
                <Button
                  type="button"
                  onClick={handleAiAnalysis}
                  disabled={aiLoading}
                  variant="success"
                  size="xl"
                  className="px-8"
                  data-tour="ai-analysis-btn"
                >
                  {aiLoading ? (
                    <>
                      <PulseLoader size="sm" variant="success" className="mr-3" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-6 h-6 mr-3" />
                      AI Analysis
                    </>
                  )}
                </Button>
              )}
            </div>
            </TransitionWrapper>
          </form>
        </CardContent>
      </Card>
      </TransitionWrapper>

        {/* Results */}
        {(result || anomalyResult) && (
          <TransitionWrapper animation="fade" delay={100}>
            <div className="animate-fade-in-up">
              <LogAnalysisResults
                result={result}
                anomalyResult={anomalyResult}
                aiRecommendations={aiRecommendations}
              />
            </div>
          </TransitionWrapper>
        )}

        {/* Proactive Alerting & Root Cause Analysis */}
        {showProactiveFeatures && (
          <div className="space-y-8 mt-12">
            {/* Alert Panel */}
            <TransitionWrapper animation="slide" delay={200}>
              <AlertPanel
                alerts={alerts}
                onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                onDismiss={(alertId) => {
                  setAlerts(prev => prev.filter(alert => alert.id !== alertId))
                }}
              />
            </TransitionWrapper>

            {/* Root Cause Analysis */}
            {rootCauseAnalysis && (
              <TransitionWrapper animation="slide" delay={300}>
                <RootCauseAnalysis
                  analysis={rootCauseAnalysis}
                  onActionClick={(action) => console.log('Action clicked:', action)}
                />
              </TransitionWrapper>
            )}

            {/* AI Insights Panel */}
            {aiInsights.length > 0 && (
              <TransitionWrapper animation="slide" delay={400}>
                <AIInsightsPanel
                  insights={aiInsights}
                  onInsightClick={(insight) => console.log('Insight clicked:', insight)}
                  onActionClick={(action) => console.log('Action clicked:', action)}
                />
              </TransitionWrapper>
            )}
          </div>
        )}






    </div>
  )
}
