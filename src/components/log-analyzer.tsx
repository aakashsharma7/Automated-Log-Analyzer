'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { LogAnalysisResults } from '@/components/log-analysis-results'
import {
  Upload, FileText, Brain, AlertTriangle, BarChart3,
  Sparkles, Zap, Search, Command, Terminal, Activity,
  ChevronRight, X, Plus
} from 'lucide-react'
import { LogEntry, LogAnalysis, AnomalyDetectionResult, AiRecommendations } from '@/types'
import { useCommandPaletteContext } from '@/components/ui/command-palette-provider'

/* ──────────────────────────────────────────────
   Bauhaus Terminal — Log Analyzer
   ────────────────────────────────────────────── */

export function LogAnalyzer() {
  const { openCommandPalette, setCustomCommands } = useCommandPaletteContext()
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState<'parse' | 'anomaly'>('parse')
  const [files, setFiles] = useState<File[]>([])
  const [content, setContent] = useState('')
  const [format, setFormat] = useState('auto')
  const [contamination, setContamination] = useState(0.1)
  const [threshold, setThreshold] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    rows: number; columns: string[]; sample: LogEntry[]; stats: LogAnalysis
  } | null>(null)
  const [anomalyResult, setAnomalyResult] = useState<AnomalyDetectionResult | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<{
    ai_recommendations: AiRecommendations; context: any
  } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  /* ── Command palette ── */
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
      description: 'Execute the current analysis',
      category: 'actions' as const,
      icon: Zap,
      keywords: ['run', 'execute', 'analyze', 'start'],
      action: () => handleSubmit(new Event('submit') as any),
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
  ], [mode])

  React.useEffect(() => {
    setCustomCommands(customCommands)
  }, [setCustomCommands, customCommands])

  // Prevent SSR/CSR hydration mismatch from useDropzone dynamic props
  React.useEffect(() => { setIsMounted(true) }, [])

  /* ── Dropzone ── */
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

  /* ── Submit ── */
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

      const response = await fetch(url, { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Request failed')

      if (mode === 'parse') setResult(data)
      else setAnomalyResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
      setResult({
        rows: 0, columns: [], sample: [],
        stats: {
          basicStats: { totalLogs: 0, uniqueSources: 0, uniqueIps: 0, dateRange: { start: null, end: null } },
          timeAnalysis: {},
          errorAnalysis: { totalErrors: 0 },
          ipAnalysis: {}, sourceAnalysis: {}, performanceMetrics: {},
          securityAnalysis: { potentialThreats: 0, suspiciousPatterns: [], failedAttempts: 0 },
          recommendations: [],
          processedAt: new Date().toISOString()
        }
      })
    } finally {
      setLoading(false)
    }
  }

  /* ── AI Analysis ── */
  const handleAiAnalysis = async () => {
    if (!result || result.rows === 0) return
    setAiLoading(true)
    setAiRecommendations(null)

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (content.trim()) formData.append('content', content)
    formData.append('format', format)

    try {
      const response = await fetch('/api/ai-analysis', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'AI analysis failed')
      setAiRecommendations(data)
      setTimeout(() => {
        document.getElementById('ai-recommendations')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      console.error('AI analysis failed:', error)
      setAiRecommendations({
        ai_recommendations: {
          rootCause: 'AI analysis failed', fixSteps: [], prevention: [],
          monitoring: [], references: [], confidence: 'Low'
        },
        context: {}
      })
    } finally {
      setAiLoading(false)
    }
  }

  const isParseMode = mode === 'parse'

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════
          TOP BAR — Terminal header
          ════════════════════════════════════════ */}
      <header className="border-b border-[#2C2C2C] bg-[#0E0E0E]">
        {/* Yellow accent line at top */}
        <div className="h-0.5 w-full" style={{
          background: 'linear-gradient(90deg, #F5E642 0%, #FF8C00 30%, transparent 60%)'
        }} />

        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-4">
            {/* Bauhaus logo mark */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 bg-[#F5E642]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FF3131]" />
              <div className="absolute top-0 right-0 w-2 h-8 bg-[#0057FF]" />
            </div>
            <div>
              <div className="font-display text-sm font-bold tracking-[0.2em] text-[#E8E4D0] uppercase">
                Log Analyzer
              </div>
              <div className="font-mono text-[9px] text-[#3A3A3A] tracking-[0.25em] uppercase">
                Automated Intelligence System
              </div>
            </div>
          </div>

          {/* Center: mode switch pills */}
          <div className="flex items-center">
            <div className="flex border border-[#2C2C2C] bg-[#141414]">
              <button
                onClick={() => setMode('parse')}
                className={`
                  px-5 py-2 font-mono text-[10px] font-bold tracking-widest uppercase
                  flex items-center gap-2 transition-all duration-150 border-r border-[#2C2C2C]
                  ${isParseMode
                    ? 'bg-[#F5E642] text-[#080808]'
                    : 'text-[#666] hover:text-[#E8E4D0] hover:bg-[#1C1C1C]'
                  }
                `}
              >
                <BarChart3 className="w-3 h-3" />
                Parse
              </button>
              <button
                onClick={() => setMode('anomaly')}
                className={`
                  px-5 py-2 font-mono text-[10px] font-bold tracking-widest uppercase
                  flex items-center gap-2 transition-all duration-150
                  ${!isParseMode
                    ? 'bg-[#FF3131] text-[#ffffff]'
                    : 'text-[#666] hover:text-[#E8E4D0] hover:bg-[#1C1C1C]'
                  }
                `}
              >
                <AlertTriangle className="w-3 h-3" />
                Anomaly
              </button>
            </div>
          </div>

          {/* Right: command palette + status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 font-mono text-[9px] text-[#3A3A3A] tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse-green"
                style={{ boxShadow: '0 0 4px #39FF14' }} />
              READY
            </div>
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#2C2C2C] bg-[#141414]
                         font-mono text-[10px] text-[#666] tracking-widest uppercase
                         hover:border-[#F5E642] hover:text-[#F5E642] transition-all duration-150"
            >
              <Command className="w-3 h-3" />
              Ctrl+K
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero section */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-start gap-6 mb-6">
            {/* Bauhaus geometric left accent */}
            <div className="flex-shrink-0 flex flex-col gap-1 mt-1">
              <div className="w-2 h-8 bg-[#F5E642]" />
              <div className="w-2 h-4 bg-[#FF3131]" />
              <div className="w-2 h-2 bg-[#0057FF]" />
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black
                             tracking-[-0.04em] uppercase text-[#E8E4D0] leading-none mb-2">
                {isParseMode ? (
                  <>
                    <span className="grad-primary animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                      Parse &amp;
                    </span>{' '}
                    <span className="text-[#E8E4D0]">Analyze</span>
                  </>
                ) : (
                  <>
                    <span className="grad-danger animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                      Anomaly
                    </span>{' '}
                    <span className="text-[#E8E4D0]">Detection</span>
                  </>
                )}
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-[#2C2C2C]" />
                <p className="font-mono text-[11px] text-[#4A4A4A] tracking-widest uppercase">
                  {isParseMode
                    ? '// Transform log data into structured intelligence'
                    : '// Isolation Forest · ML Anomaly Detection · 21 features'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats pills */}
          <div className="flex flex-wrap gap-2 ml-9">
            {[
              { label: 'Multi-format', color: '#F5E642' },
              { label: 'Auto-detect', color: '#39FF14' },
              { label: 'AI-powered', color: '#0057FF' },
              { label: 'Real-time', color: '#FF3131' },
            ].map(({ label, color }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 border border-[#2C2C2C] bg-[#141414]"
              >
                <div className="w-1 h-1" style={{ background: color }} />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#666]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN TERMINAL PANEL ── */}
        <form onSubmit={handleSubmit}>
          <div className="term-window mb-6 animate-scale-in">

            {/* Terminal title bar */}
            <div className="term-window-bar">
              <div className="term-dot term-dot-r" />
              <div className="term-dot term-dot-y" />
              <div className="term-dot term-dot-g" />
              <div className="term-window-title">
                {isParseMode
                  ? 'log-analyzer.sh — parse mode'
                  : 'anomaly-detector.sh — detection mode'}
              </div>
              <div className="flex items-center gap-1 text-[#2C2C2C]">
                <Terminal className="w-3 h-3" />
              </div>
            </div>

            {/* Panel body */}
            <div className="p-6 space-y-6">

              {/* ── File upload zone ── */}
              <div className="space-y-3">
                <div className="term-section-header">Upload Files</div>

                <div
                  {...(isMounted ? getRootProps() : {})}
                  suppressHydrationWarning
                  className={`term-dropzone p-10 text-center transition-all duration-150 ${isMounted && isDragActive ? 'active' : ''}`}
                >
                  {isMounted && <input {...getInputProps()} />}

                  {/* Upload icon — Bauhaus geometric style */}
                  <div className="flex justify-center mb-5">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className={`absolute inset-0 transition-colors duration-150 ${
                        isDragActive ? 'bg-[#F5E642]' : 'bg-[#1C1C1C] border border-[#2C2C2C]'
                      }`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className={`w-5 h-5 ${isDragActive ? 'text-[#080808]' : 'text-[#3A3A3A]'}`} />
                      </div>
                      {/* Corner accent */}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 transition-colors duration-150 ${
                        isDragActive ? 'bg-[#FF3131]' : 'bg-[#2C2C2C]'
                      }`} />
                    </div>
                  </div>

                  {isDragActive ? (
                    <div>
                      <div className="font-display text-base font-bold text-[#F5E642] tracking-tight uppercase mb-1">
                        Drop to Upload
                      </div>
                      <div className="font-mono text-[10px] text-[#F5E642]/60 tracking-widest">
                        // release to process
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-display text-sm font-bold text-[#E8E4D0] tracking-tight uppercase mb-2">
                        Drag &amp; drop files here
                      </div>
                      <div className="font-mono text-[10px] text-[#3A3A3A] tracking-widest mb-3">
                        // or click to select
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['.log', '.txt', '.json', '.csv'].map(ext => (
                          <span key={ext} className="term-badge term-badge-dim">{ext}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="bg-[#0E0E0E] border border-[#2C2C2C] border-l-[#39FF14] border-l-2 p-4 animate-slide-up">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-3 h-3 text-[#39FF14]" />
                      <span className="font-mono text-[10px] text-[#39FF14] tracking-widest uppercase">
                        {files.length} file{files.length > 1 ? 's' : ''} queued
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#2C2C2C]
                                     hover:border-[#F5E642] transition-colors duration-150 group"
                        >
                          <span className="font-mono text-[10px] text-[#A8A090] group-hover:text-[#E8E4D0] transition-colors">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFiles(f => f.filter((_, i) => i !== index))}
                            className="text-[#3A3A3A] hover:text-[#FF3131] transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Content paste ── */}
              <div className="space-y-2">
                <div className="term-section-header">Paste Content</div>
                <div className="relative">
                  <div className="absolute top-3 left-3 font-mono text-[10px] text-[#F5E642] select-none pointer-events-none">
                    &gt;
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="paste log content here for analysis..."
                    rows={5}
                    className="term-input pl-8 resize-none"
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>

              {/* ── Parse mode: format select ── */}
              {isParseMode && (
                <div className="space-y-2">
                  <div className="term-section-header">Log Format</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { value: 'auto',   label: 'Auto',   symbol: '🔍' },
                      { value: 'apache', label: 'Apache', symbol: 'A' },
                      { value: 'nginx',  label: 'Nginx',  symbol: 'N' },
                      { value: 'syslog', label: 'Syslog', symbol: 'S' },
                      { value: 'json',   label: 'JSON',   symbol: '{}' },
                      { value: 'custom', label: 'Custom', symbol: '⚙' },
                    ].map(({ value, label, symbol }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormat(value)}
                        className={`
                          py-2.5 px-3 border font-mono text-[10px] tracking-widest uppercase
                          transition-all duration-150 flex flex-col items-center gap-1
                          ${format === value
                            ? 'border-[#F5E642] bg-[rgba(245,230,66,0.08)] text-[#F5E642]'
                            : 'border-[#2C2C2C] bg-[#141414] text-[#4A4A4A] hover:border-[#3A3A3A] hover:text-[#A8A090]'
                          }
                        `}
                      >
                        <span className="text-xs">{symbol}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Anomaly mode: parameters ── */}
              {!isParseMode && (
                <div className="space-y-3">
                  <div className="term-section-header">Detection Parameters</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-[#666] tracking-widest uppercase block">
                        Contamination Rate
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#FF3131]">!</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="0.5"
                          value={contamination}
                          onChange={(e) => setContamination(parseFloat(e.target.value))}
                          className="term-input pl-8"
                        />
                      </div>
                      <div className="font-mono text-[9px] text-[#3A3A3A] tracking-wide">
                        // expected anomaly proportion (0.01–0.50)
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-[#666] tracking-widest uppercase block">
                        Custom Threshold <span className="text-[#2C2C2C]">(optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#F5E642]">&gt;</span>
                        <input
                          type="number"
                          step="0.01"
                          value={threshold}
                          onChange={(e) => setThreshold(e.target.value)}
                          placeholder="0.50"
                          className="term-input pl-8"
                        />
                      </div>
                      <div className="font-mono text-[9px] text-[#3A3A3A] tracking-wide">
                        // override anomaly score cutoff
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#1C1C1C]">

                {/* Primary action */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    flex-1 flex items-center justify-center gap-3 px-6 py-3
                    font-mono text-[11px] font-bold tracking-widest uppercase
                    border transition-all duration-150 relative overflow-hidden
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isParseMode
                      ? 'bg-[#F5E642] text-[#080808] border-[#F5E642] hover:bg-[#FFD700] hover:shadow-[0_0_24px_rgba(245,230,66,0.4)]'
                      : 'bg-[#FF3131] text-white border-[#FF3131] hover:bg-[#CC1A1A] hover:shadow-[0_0_24px_rgba(255,49,49,0.4)]'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing<span className="animate-cursor-blink">_</span></span>
                    </>
                  ) : isParseMode ? (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Parse &amp; Analyze</span>
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Detect Anomalies</span>
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </>
                  )}
                </button>

                {/* AI Analysis (conditional) */}
                {result && result.rows > 0 && isParseMode && (
                  <button
                    type="button"
                    onClick={handleAiAnalysis}
                    disabled={aiLoading}
                    data-tour="ai-analysis-btn"
                    className="
                      flex items-center justify-center gap-2 px-6 py-3
                      font-mono text-[11px] font-bold tracking-widest uppercase
                      border border-[#39FF14] text-[#39FF14]
                      hover:bg-[rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]
                      transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-3 h-3 border border-[#39FF14] border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing<span className="animate-cursor-blink text-[#39FF14]">_</span></span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5" />
                        <span>AI Analysis</span>
                      </>
                    )}
                  </button>
                )}

                {/* Clear */}
                {(files.length > 0 || content) && (
                  <button
                    type="button"
                    onClick={() => { setFiles([]); setContent('') }}
                    className="
                      flex items-center justify-center gap-2 px-4 py-3
                      font-mono text-[11px] tracking-widest uppercase
                      border border-[#2C2C2C] text-[#3A3A3A]
                      hover:border-[#3A3A3A] hover:text-[#666]
                      transition-all duration-150
                    "
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

            </div>
          </div>
        </form>

        {/* ── STATUS BAR (after submit) ── */}
        {(loading || result || anomalyResult) && (
          <div className="mb-6 font-mono text-[10px] tracking-widest border border-[#2C2C2C] bg-[#0E0E0E] px-4 py-2
                          flex items-center gap-3 animate-fade-in-up">
            {loading ? (
              <>
                <div className="term-scan-bar w-24" />
                <span className="text-[#F5E642]">Processing logs<span className="animate-cursor-blink">_</span></span>
              </>
            ) : result ? (
              <>
                <div className="w-1.5 h-1.5 bg-[#39FF14]" style={{ boxShadow: '0 0 4px #39FF14' }} />
                <span className="text-[#39FF14]">Analysis complete</span>
                <span className="text-[#2C2C2C]">|</span>
                <span className="text-[#4A4A4A]">{result.rows.toLocaleString()} log entries processed</span>
                <span className="text-[#2C2C2C]">|</span>
                <span className="text-[#F5E642]">{result.stats?.basicStats?.errorRate?.toFixed(1) ?? '0.0'}% error rate</span>
              </>
            ) : anomalyResult ? (
              <>
                <div className="w-1.5 h-1.5 bg-[#FF3131]" style={{ boxShadow: '0 0 4px #FF3131' }} />
                <span className="text-[#FF3131]">Detection complete</span>
                <span className="text-[#2C2C2C]">|</span>
                <span className="text-[#4A4A4A]">{anomalyResult.total} anomalies found</span>
              </>
            ) : null}
          </div>
        )}

        {/* ── RESULTS ── */}
        {(result || anomalyResult) && (
          <div className="animate-fade-in-up">
            <LogAnalysisResults
              result={result}
              anomalyResult={anomalyResult}
              aiRecommendations={aiRecommendations}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default LogAnalyzer
