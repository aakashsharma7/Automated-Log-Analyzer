'use client'

import * as React from "react"
import { memo } from "react"
import { ChevronDown, ChevronRight, Eye, EyeOff, Info, MoreHorizontal } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface ProgressiveDisclosureProps {
  children: React.ReactNode
  className?: string
  defaultExpanded?: boolean
  title?: string
  description?: string
  level?: 'basic' | 'intermediate' | 'advanced'
  variant?: 'default' | 'compact' | 'minimal'
  showToggle?: boolean
  onToggle?: (expanded: boolean) => void
}

export const ProgressiveDisclosure = memo(function ProgressiveDisclosure({
  children,
  className,
  defaultExpanded = false,
  title,
  description,
  level = 'basic',
  variant = 'default',
  showToggle = true,
  onToggle
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onToggle?.(newExpanded)
  }

  const levelConfig = {
    basic: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Basic' },
    intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Intermediate' },
    advanced: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Advanced' }
  }

  const variantConfig = {
    default: 'p-4',
    compact: 'p-2',
    minimal: 'p-1'
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <Badge variant="outline" className={cn("text-xs", levelConfig[level].color, levelConfig[level].bg)}>
                {levelConfig[level].label}
              </Badge>
            </div>
            {showToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="text-slate-400 hover:text-white hover-soft-scale"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-sm text-slate-400">{description}</p>
      )}

      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "opacity-100 max-h-none" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        <div className={variantConfig[variant]}>
          {children}
        </div>
      </div>
    </div>
  )
})

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  level?: 'basic' | 'intermediate' | 'advanced'
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  level = 'basic',
  icon: Icon,
  className
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const levelConfig = {
    basic: 'border-green-500/20',
    intermediate: 'border-yellow-500/20',
    advanced: 'border-red-500/20'
  }

  return (
    <Card className={cn("glass-card transition-all duration-300 hover-soft-lift", levelConfig[level], className)}>
      <CardHeader 
        className="cursor-pointer select-none p-4 sm:p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {Icon && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
            <CardTitle className="text-base sm:text-lg font-outfit font-bold text-white truncate">
              {title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover-soft-scale flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "opacity-100 max-h-none" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </div>
    </Card>
  )
}

interface SummaryCardProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  level?: 'basic' | 'intermediate' | 'advanced'
  onClick?: () => void
  className?: string
}

export function SummaryCard({
  title,
  value,
  description,
  trend = 'neutral',
  level = 'basic',
  onClick,
  className
}: SummaryCardProps) {
  const trendConfig = {
    up: { color: 'text-green-400', icon: '↗' },
    down: { color: 'text-red-400', icon: '↘' },
    neutral: { color: 'text-slate-400', icon: '→' }
  }

  const levelConfig = {
    basic: 'border-green-500/20 hover:border-green-400/40',
    intermediate: 'border-yellow-500/20 hover:border-yellow-400/40',
    advanced: 'border-red-500/20 hover:border-red-400/40'
  }

  return (
    <Card 
      className={cn(
        "glass-card transition-all duration-300 hover-soft-lift cursor-pointer",
        levelConfig[level],
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-400 mb-1">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            {description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <span className={cn("text-base sm:text-lg", trendConfig[trend].color)}>
              {trendConfig[trend].icon}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExpandableDetailsProps {
  summary: React.ReactNode
  details: React.ReactNode
  defaultExpanded?: boolean
  level?: 'basic' | 'intermediate' | 'advanced'
  className?: string
}

export function ExpandableDetails({
  summary,
  details,
  defaultExpanded = false,
  level = 'basic',
  className
}: ExpandableDetailsProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const levelConfig = {
    basic: 'border-green-500/20',
    intermediate: 'border-yellow-500/20',
    advanced: 'border-red-500/20'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div 
        className={cn(
          "p-3 glass-card rounded-lg cursor-pointer transition-all duration-300 hover-soft-lift",
          levelConfig[level]
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">{summary}</div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover-soft-scale"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "opacity-100 max-h-none" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        <div className="p-3 glass-card rounded-lg">
          {details}
        </div>
      </div>
    </div>
  )
}

interface ProgressiveTabsProps {
  tabs: Array<{
    id: string
    label: string
    level: 'basic' | 'intermediate' | 'advanced'
    content: React.ReactNode
    summary?: React.ReactNode
  }>
  defaultTab?: string
  className?: string
}

export function ProgressiveTabs({
  tabs,
  defaultTab,
  className
}: ProgressiveTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id)

  const levelConfig = {
    basic: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    advanced: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover-soft-scale",
              activeTab === tab.id 
                ? levelConfig[tab.level].bg 
                : "hover:bg-slate-700/50"
            )}
          >
            <span>{tab.label}</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs", levelConfig[tab.level].color, levelConfig[tab.level].bg)}
            >
              {tab.level}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTabData && (
        <div className="space-y-4">
          {activeTabData.summary && (
            <div className="p-4 glass-card rounded-lg">
              {activeTabData.summary}
            </div>
          )}
          <div className={cn("p-4 glass-card rounded-lg", levelConfig[activeTabData.level].border)}>
            {activeTabData.content}
          </div>
        </div>
      )}
    </div>
  )
}

interface VisibilityToggleProps {
  children: React.ReactNode
  title: string
  defaultVisible?: boolean
  level?: 'basic' | 'intermediate' | 'advanced'
  className?: string
}

export function VisibilityToggle({
  children,
  title,
  defaultVisible = true,
  level = 'basic',
  className
}: VisibilityToggleProps) {
  const [isVisible, setIsVisible] = React.useState(defaultVisible)

  const levelConfig = {
    basic: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="text-slate-400 hover:text-white hover-soft-scale"
        >
          {isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {isVisible && (
        <div className="animate-fade-in-up">
          {children}
        </div>
      )}
    </div>
  )
}
