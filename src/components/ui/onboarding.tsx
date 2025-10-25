'use client'

import * as React from "react"
import { X, ChevronLeft, ChevronRight, CheckCircle, ArrowRight, HelpCircle, Lightbulb, Target, Zap } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: {
    label: string
    onClick: () => void
  }
  skipable?: boolean
}

interface OnboardingProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  steps: OnboardingStep[]
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
}

export function Onboarding({
  isOpen,
  onClose,
  onComplete,
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSkip
}: OnboardingProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      onNext()
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      onPrevious()
    }
  }

  if (!isOpen || !isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Onboarding Modal */}
      <Card className="relative w-full max-w-2xl mx-4 glass-modal animate-scale-in-bounce">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-outfit font-bold text-white">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Step {currentStep + 1} of {steps.length}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-slate-400 font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[200px] animate-fade-in-up">
            {currentStepData.content}
          </div>
          
          {/* Step Description */}
          <div className="p-4 glass-card rounded-lg">
            <p className="text-slate-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
          
          {/* Action Button */}
          {currentStepData.action && (
            <div className="flex justify-center">
              <Button
                onClick={currentStepData.action.onClick}
                variant="premium"
                className="animate-bounce-soft"
              >
                {currentStepData.action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="hover-soft-scale"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStepData.skipable && (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-slate-400 hover:text-white"
                >
                  Skip
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                variant={isLastStep ? "success" : "premium"}
                className="hover-soft-scale"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Onboarding Hook
export function useOnboarding() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [hasCompleted, setHasCompleted] = React.useState(false)

  const openOnboarding = React.useCallback(() => {
    setIsOpen(true)
    setCurrentStep(0)
  }, [])

  const closeOnboarding = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const nextStep = React.useCallback(() => {
    setCurrentStep(prev => prev + 1)
  }, [])

  const previousStep = React.useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  const skipOnboarding = React.useCallback(() => {
    setIsOpen(false)
    setHasCompleted(true)
  }, [])

  const completeOnboarding = React.useCallback(() => {
    setIsOpen(false)
    setHasCompleted(true)
    // Store completion in localStorage
    localStorage.setItem('log-analyzer-onboarding-completed', 'true')
  }, [])

  const resetOnboarding = React.useCallback(() => {
    setHasCompleted(false)
    setCurrentStep(0)
    localStorage.removeItem('log-analyzer-onboarding-completed')
  }, [])

  // Check if onboarding was completed before
  React.useEffect(() => {
    const completed = localStorage.getItem('log-analyzer-onboarding-completed')
    if (completed) {
      setHasCompleted(true)
    }
  }, [])

  return {
    isOpen,
    currentStep,
    hasCompleted,
    openOnboarding,
    closeOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding
  }
}

// Feature Highlight Component
interface FeatureHighlightProps {
  isVisible: boolean
  target: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  onClose: () => void
  onAction?: () => void
  actionLabel?: string
}

export function FeatureHighlight({
  isVisible,
  target,
  title,
  description,
  position = 'bottom',
  onClose,
  onAction,
  actionLabel = 'Try it'
}: FeatureHighlightProps) {
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const element = document.querySelector(`[data-tour="${target}"]`) as HTMLElement
    setTargetElement(element)
  }, [target])

  if (!isVisible || !targetElement) return null

  const rect = targetElement.getBoundingClientRect()
  
  const getPosition = () => {
    switch (position) {
      case 'top':
        return {
          top: rect.top - 20,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) translateY(-100%)'
        }
      case 'bottom':
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)'
        }
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 20,
          transform: 'translateY(-50%) translateX(-100%)'
        }
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 20,
          transform: 'translateY(-50%)'
        }
      default:
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)'
        }
    }
  }

  const positionStyle = getPosition()

  return (
    <>
      {/* Highlight Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div 
          className="absolute bg-blue-500/20 border-2 border-blue-400 rounded-lg animate-pulse-glow"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            pointerEvents: 'none'
          }}
        />
      </div>
      
      {/* Tooltip */}
      <div
        className="fixed z-50 animate-scale-in-bounce"
        style={positionStyle}
      >
        <Card className="glass-modal w-80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                <CardTitle className="text-lg font-outfit font-bold text-white">
                  {title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-slate-300 text-sm mb-4">{description}</p>
            {onAction && (
              <Button
                onClick={onAction}
                variant="premium"
                size="sm"
                className="w-full hover-soft-scale"
              >
                {actionLabel}
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Quick Tips Component
interface QuickTip {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: 'feature' | 'shortcut' | 'tip'
}

interface QuickTipsProps {
  tips: QuickTip[]
  onClose: () => void
}

export function QuickTips({ tips, onClose }: QuickTipsProps) {
  const [currentTip, setCurrentTip] = React.useState(0)

  const nextTip = () => {
    setCurrentTip(prev => (prev + 1) % tips.length)
  }

  const previousTip = () => {
    setCurrentTip(prev => (prev - 1 + tips.length) % tips.length)
  }

  const currentTipData = tips[currentTip]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="glass-modal w-80 animate-slide-in-right">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <CardTitle className="text-lg font-outfit font-bold text-white">
                Quick Tip
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <currentTipData.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{currentTipData.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {currentTipData.category}
                </Badge>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{currentTipData.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousTip}
                  className="text-slate-400 hover:text-white h-6 w-6 p-0"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs text-slate-400">
                  {currentTip + 1} of {tips.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTip}
                  className="text-slate-400 hover:text-white h-6 w-6 p-0"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Got it
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
