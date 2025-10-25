'use client'

import * as React from "react"
import { Search, FileText, BarChart3, Settings, BookOpen, Zap, Clock, AlertTriangle, Brain, Filter, Download, Upload, RefreshCw, Eye, EyeOff, ChevronRight } from "lucide-react"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface Command {
  id: string
  title: string
  description: string
  category: 'navigation' | 'actions' | 'settings' | 'documentation' | 'analysis' | 'export'
  icon: React.ComponentType<{ className?: string }>
  keywords: string[]
  action: () => void
  shortcut?: string
  badge?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (path: string) => void
  onAction?: (action: string) => void
  customCommands?: Command[]
}

const commands: Command[] = [
  // Navigation Commands
  {
    id: 'view-logs',
    title: 'View Log Files',
    description: 'Browse and analyze uploaded log files',
    category: 'navigation',
    icon: FileText,
    keywords: ['logs', 'files', 'browse', 'view'],
    action: () => {},
    shortcut: 'Ctrl+L'
  },
  {
    id: 'view-metrics',
    title: 'View Metrics Dashboard',
    description: 'Open the metrics and analytics dashboard',
    category: 'navigation',
    icon: BarChart3,
    keywords: ['metrics', 'dashboard', 'analytics', 'charts'],
    action: () => {},
    shortcut: 'Ctrl+M'
  },
  {
    id: 'view-anomalies',
    title: 'View Anomaly Detection',
    description: 'Check detected anomalies and alerts',
    category: 'navigation',
    icon: AlertTriangle,
    keywords: ['anomalies', 'alerts', 'detection', 'issues'],
    action: () => {},
    shortcut: 'Ctrl+A'
  },
  {
    id: 'view-ai-insights',
    title: 'View AI Insights',
    description: 'Access AI-powered analysis and recommendations',
    category: 'navigation',
    icon: Brain,
    keywords: ['ai', 'insights', 'analysis', 'recommendations'],
    action: () => {},
    shortcut: 'Ctrl+I'
  },

  // Action Commands
  {
    id: 'upload-logs',
    title: 'Upload Log Files',
    description: 'Upload new log files for analysis',
    category: 'actions',
    icon: Upload,
    keywords: ['upload', 'files', 'logs', 'import'],
    action: () => {},
    shortcut: 'Ctrl+U'
  },
  {
    id: 'export-results',
    title: 'Export Analysis Results',
    description: 'Download analysis results and reports',
    category: 'actions',
    icon: Download,
    keywords: ['export', 'download', 'results', 'reports'],
    action: () => {},
    shortcut: 'Ctrl+E'
  },
  {
    id: 'refresh-analysis',
    title: 'Refresh Analysis',
    description: 'Re-run the current analysis',
    category: 'actions',
    icon: RefreshCw,
    keywords: ['refresh', 'reload', 'rerun', 'update'],
    action: () => {},
    shortcut: 'F5'
  },
  {
    id: 'toggle-dark-mode',
    title: 'Toggle Dark Mode',
    description: 'Switch between light and dark themes',
    category: 'actions',
    icon: Eye,
    keywords: ['theme', 'dark', 'light', 'toggle'],
    action: () => {},
    shortcut: 'Ctrl+D'
  },

  // Analysis Commands
  {
    id: 'run-anomaly-detection',
    title: 'Run Anomaly Detection',
    description: 'Execute anomaly detection on current logs',
    category: 'analysis',
    icon: Zap,
    keywords: ['anomaly', 'detection', 'run', 'execute'],
    action: () => {},
    badge: 'AI'
  },
  {
    id: 'filter-logs',
    title: 'Filter Logs',
    description: 'Apply filters to log data',
    category: 'analysis',
    icon: Filter,
    keywords: ['filter', 'search', 'query', 'find'],
    action: () => {},
    shortcut: 'Ctrl+F'
  },
  {
    id: 'time-range-analysis',
    title: 'Time Range Analysis',
    description: 'Analyze logs within specific time ranges',
    category: 'analysis',
    icon: Clock,
    keywords: ['time', 'range', 'period', 'duration'],
    action: () => {}
  },

  // Settings Commands
  {
    id: 'open-settings',
    title: 'Open Settings',
    description: 'Access application settings and preferences',
    category: 'settings',
    icon: Settings,
    keywords: ['settings', 'preferences', 'config', 'options'],
    action: () => {},
    shortcut: 'Ctrl+,'
  },
  {
    id: 'notification-settings',
    title: 'Notification Settings',
    description: 'Configure alert and notification preferences',
    category: 'settings',
    icon: AlertTriangle,
    keywords: ['notifications', 'alerts', 'preferences'],
    action: () => {}
  },

  // Documentation Commands
  {
    id: 'view-docs',
    title: 'View Documentation',
    description: 'Open the user guide and documentation',
    category: 'documentation',
    icon: BookOpen,
    keywords: ['docs', 'documentation', 'help', 'guide'],
    action: () => {},
    shortcut: 'F1'
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'View API documentation and endpoints',
    category: 'documentation',
    icon: BookOpen,
    keywords: ['api', 'reference', 'endpoints', 'documentation'],
    action: () => {}
  }
]

const categoryConfig = {
  navigation: { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/20" },
  actions: { icon: Zap, color: "text-green-400", bg: "bg-green-500/20" },
  settings: { icon: Settings, color: "text-purple-400", bg: "bg-purple-500/20" },
  documentation: { icon: BookOpen, color: "text-orange-400", bg: "bg-orange-500/20" },
  analysis: { icon: Brain, color: "text-pink-400", bg: "bg-pink-500/20" },
  export: { icon: Download, color: "text-cyan-400", bg: "bg-cyan-500/20" }
}

export function CommandPalette({ isOpen, onClose, onNavigate, onAction, customCommands = [] }: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Combine default and custom commands
  const allCommands = React.useMemo(() => [...commands, ...customCommands], [customCommands])

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return allCommands

    const searchTerm = query.toLowerCase()
    return allCommands.filter(command => 
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      command.category.toLowerCase().includes(searchTerm)
    )
  }, [query, allCommands])

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = []
      }
      groups[command.category].push(command)
    })
    return groups
  }, [filteredCommands])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
            onClose()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle global keyboard shortcut
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        // This will be handled by the parent component
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <Card className="relative w-full max-w-2xl mx-4 glass-modal animate-scale-in-bounce">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 animate-slide-in-right">
            <Search className="w-5 h-5 text-slate-400 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands, navigate, or get help..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-lg font-medium transition-all duration-200 focus:placeholder:text-slate-600"
            />
            <Badge variant="outline" className="text-xs animate-bounce-soft">
              ESC
            </Badge>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center animate-fade-in-up">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No commands found</h3>
                <p className="text-slate-400">Try a different search term</p>
              </div>
            ) : (
              <div className="p-2 animate-fade-in-up">
                {Object.entries(groupedCommands).map(([category, categoryCommands]) => {
                  const categoryInfo = categoryConfig[category as keyof typeof categoryConfig]
                  const CategoryIcon = categoryInfo.icon

                  return (
                    <div key={category} className="mb-4">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 px-3 py-2 mb-2">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center",
                          categoryInfo.bg
                        )}>
                          <CategoryIcon className={cn("w-3 h-3", categoryInfo.color)} />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                          {category}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent" />
                      </div>

                      {/* Category Commands */}
                      <div className="space-y-1">
                        {categoryCommands.map((command, index) => {
                          const globalIndex = filteredCommands.indexOf(command)
                          const isSelected = globalIndex === selectedIndex
                          const Icon = command.icon

                          return (
                            <button
                              key={command.id}
                              onClick={() => {
                                command.action()
                                onClose()
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left animate-slide-in-right",
                                isSelected
                                  ? "bg-purple-500/20 border border-purple-500/30 hover-soft-lift shadow-lg"
                                  : "hover:bg-white/5 hover-soft-scale hover:shadow-md"
                              )}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              {/* Command Icon */}
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                isSelected ? "bg-purple-500/30" : "bg-slate-700/50"
                              )}>
                                <Icon className={cn(
                                  "w-4 h-4",
                                  isSelected ? "text-purple-300" : "text-slate-400"
                                )} />
                              </div>

                              {/* Command Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={cn(
                                    "font-medium",
                                    isSelected ? "text-white" : "text-slate-200"
                                  )}>
                                    {command.title}
                                  </h4>
                                  {command.badge && (
                                    <Badge variant="outline" className="text-xs">
                                      {command.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className={cn(
                                  "text-sm",
                                  isSelected ? "text-slate-300" : "text-slate-400"
                                )}>
                                  {command.description}
                                </p>
                              </div>

                              {/* Shortcut */}
                              {command.shortcut && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">
                                    {command.shortcut}
                                  </kbd>
                                </div>
                              )}

                              {/* Selection Indicator */}
                              {isSelected && (
                                <ChevronRight className="w-4 h-4 text-purple-400" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-white/10 bg-slate-900/50 animate-slide-in-up">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</kbd>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↵</kbd>
                <span>select</span>
              </div>
              <div className="flex items-center gap-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">esc</kbd>
                <span>close</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for using command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false)

  const openCommandPalette = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCommandPalette = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleCommandPalette = React.useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Global keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openCommandPalette])

  return {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette
  }
}
