import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "premium" | "success" | "warning" | "error"
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
}

const variantClasses = {
  default: "border-blue-500",
  premium: "border-purple-500",
  success: "border-green-500", 
  warning: "border-yellow-500",
  error: "border-red-500"
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-transparent border-t-current",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function PulseLoader({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            size === "sm" && "w-2 h-2",
            size === "md" && "w-3 h-3", 
            size === "lg" && "w-4 h-4",
            size === "xl" && "w-6 h-6",
            variant === "default" && "bg-blue-500",
            variant === "premium" && "bg-purple-500",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500", 
            variant === "error" && "bg-red-500"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  )
}

export function BounceLoader({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-bounce",
            size === "sm" && "w-2 h-2",
            size === "md" && "w-3 h-3",
            size === "lg" && "w-4 h-4", 
            size === "xl" && "w-6 h-6",
            variant === "default" && "bg-blue-500",
            variant === "premium" && "bg-purple-500",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500",
            variant === "error" && "bg-red-500"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s"
          }}
        />
      ))}
    </div>
  )
}

export function WaveLoader({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-end space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-sm animate-pulse",
            size === "sm" && "w-1 h-3",
            size === "md" && "w-1.5 h-4",
            size === "lg" && "w-2 h-6",
            size === "xl" && "w-3 h-8",
            variant === "default" && "bg-blue-500",
            variant === "premium" && "bg-purple-500", 
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500",
            variant === "error" && "bg-red-500"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.2s"
          }}
        />
      ))}
    </div>
  )
}
