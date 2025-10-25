import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error" | "premium"
  showPercentage?: boolean
  animated?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-2",
  md: "h-3", 
  lg: "h-4"
}

const variantClasses = {
  default: "bg-gradient-to-r from-blue-500 to-blue-600",
  success: "bg-gradient-to-r from-green-500 to-emerald-600",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-600", 
  error: "bg-gradient-to-r from-red-500 to-pink-600",
  premium: "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default", 
  showPercentage = false,
  animated = true,
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">Progress</span>
        {showPercentage && (
          <span className="text-sm text-slate-400">{Math.round(percentage)}%</span>
        )}
      </div>
      <div 
        className={cn(
          "w-full bg-slate-700 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant],
            animated && "animate-gradient-shift"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CircularProgress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showPercentage = false,
  animated = true,
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = size === "sm" ? 20 : size === "md" ? 30 : 40
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 6
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: "#3b82f6",
    success: "#10b981", 
    warning: "#f59e0b",
    error: "#ef4444",
    premium: "#8b5cf6"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className={cn(
          "transform -rotate-90",
          size === "sm" && "w-12 h-12",
          size === "md" && "w-20 h-20", 
          size === "lg" && "w-28 h-28"
        )}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-out",
            animated && "animate-pulse"
          )}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-semibold text-slate-200",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

export function StepProgress({
  steps,
  currentStep,
  variant = "default",
  className
}: {
  steps: string[]
  currentStep: number
  variant?: "default" | "success" | "warning" | "error" | "premium"
  className?: string
}) {
  const variantColors = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    error: "bg-red-500",
    premium: "bg-purple-500"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  index < currentStep
                    ? `${variantColors[variant]} text-white animate-scale-in-bounce`
                    : index === currentStep
                    ? `${variantColors[variant]} text-white animate-pulse-glow`
                    : "bg-slate-700 text-slate-400"
                )}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span className={cn(
                "mt-2 text-xs text-center max-w-20",
                index <= currentStep ? "text-slate-200" : "text-slate-500"
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-all duration-300",
                  index < currentStep ? variantColors[variant] : "bg-slate-700"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
