'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogAnalysisResults } from '@/components/log-analysis-results'
import { Upload, FileText, Brain, AlertTriangle, BarChart3 } from 'lucide-react'
import { LogEntry, LogAnalysis, AnomalyDetectionResult, AiRecommendations } from '@/types'

export function LogAnalyzer() {
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-12 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Automated Log Analyzer
          </h1>
        </div>
        <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
          Intelligent log analysis with <span className="text-blue-400 font-semibold">AI-powered insights</span> and 
          <span className="text-purple-400 font-semibold"> advanced anomaly detection</span>
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Enterprise Ready</span>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8 animate-slide-in-right">
        <div className="glass-premium p-1.5 rounded-2xl shadow-xl">
          <Button
            variant={mode === 'parse' ? 'default' : 'ghost'}
            onClick={() => setMode('parse')}
            className={`rounded-xl px-6 py-3 transition-all duration-300 ${
              mode === 'parse' 
                ? 'gradient-premium text-white shadow-lg hover:shadow-xl' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Parse Logs
          </Button>
          <Button
            variant={mode === 'anomaly' ? 'default' : 'ghost'}
            onClick={() => setMode('anomaly')}
            className={`rounded-xl px-6 py-3 transition-all duration-300 ${
              mode === 'anomaly' 
                ? 'gradient-anomaly text-white shadow-lg hover:shadow-xl' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Detect Anomalies
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <Card className="glass-premium mb-8 hover-lift animate-scale-in">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'parse' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {mode === 'parse' ? (
                <FileText className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
            </div>
            {mode === 'parse' ? 'Log Parsing & Analysis' : 'Anomaly Detection'}
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            {mode === 'parse' 
              ? 'Upload log files or paste content to analyze patterns and get insights'
              : 'Detect unusual patterns and potential issues in your logs'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-3">
              <Label className="text-slate-200 font-medium">Upload Files (optional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover-lift ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-500/10 shadow-lg' 
                    : 'border-slate-600 hover:border-blue-400 hover:bg-blue-500/5'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                {isDragActive ? (
                  <p className="text-blue-300 text-lg font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-slate-200 text-lg font-medium mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-sm text-slate-400">
                      Supports .log, .txt, .json, .csv files
                    </p>
                  </div>
                )}
              </div>
              {files.length > 0 && (
                <div className="mt-4 p-4 glass rounded-xl">
                  <p className="text-sm text-slate-300 mb-3 font-medium">Selected files:</p>
                  <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg text-sm text-slate-200 font-medium hover-scale"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Input */}
            <div className="space-y-2">
              <Label>Paste Content (optional)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your log content here..."
                className="min-h-[120px]"
              />
            </div>

            {/* Format Selection (for parse mode) */}
            {mode === 'parse' && (
              <div className="space-y-2">
                <Label>Log Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="apache">Apache</SelectItem>
                    <SelectItem value="nginx">Nginx</SelectItem>
                    <SelectItem value="syslog">Syslog</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Anomaly Detection Parameters */}
            {mode === 'anomaly' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contamination</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="0.5"
                    value={contamination}
                    onChange={(e) => setContamination(parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-slate-500">
                    Expected proportion of anomalies (0.01-0.5)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Threshold (optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="Custom threshold"
                  />
                  <p className="text-xs text-slate-500">
                    Custom anomaly score threshold
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className={`flex-1 h-14 rounded-2xl font-semibold text-lg transition-all duration-300 hover-lift ${
                  mode === 'parse' 
                    ? 'gradient-premium text-white shadow-lg hover:shadow-xl' 
                    : 'gradient-anomaly text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    {mode === 'parse' ? 'Analyzing...' : 'Detecting...'}
                  </>
                ) : (
                  <>
                    {mode === 'parse' ? (
                      <>
                        <FileText className="w-5 h-5 mr-3" />
                        Parse & Analyze
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-3" />
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
                  className="h-14 px-8 rounded-2xl font-semibold text-lg gradient-ai text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-3" />
                      AI Analysis
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {(result || anomalyResult) && (
        <LogAnalysisResults
          result={result}
          anomalyResult={anomalyResult}
          aiRecommendations={aiRecommendations}
        />
      )}

    </div>
  )
}
