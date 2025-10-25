import * as React from "react"
import { cn } from "@/lib/utils"

interface TransitionWrapperProps {
  children: React.ReactNode
  className?: string
  animation?: "fade" | "slide" | "scale" | "mode" | "tab"
  delay?: number
}

export function TransitionWrapper({ 
  children, 
  className, 
  animation = "fade",
  delay = 0 
}: TransitionWrapperProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const animationClasses = {
    fade: "content-fade-in",
    slide: "content-slide-in", 
    scale: "animate-scale-in-bounce",
    mode: "mode-transition-enter-active",
    tab: "tab-transition-enter-active"
  }

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? animationClasses[animation] : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ModeTransitionProps {
  children: React.ReactNode
  isActive: boolean
  className?: string
}

export function ModeTransition({ children, isActive, className }: ModeTransitionProps) {
  const [shouldRender, setShouldRender] = React.useState(isActive)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    if (isActive) {
      setShouldRender(true)
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Match exit animation duration

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-out",
        isActive 
          ? "opacity-100 transform translate-x-0" 
          : "opacity-0 transform -translate-x-4",
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabTransitionProps {
  children: React.ReactNode
  isActive: boolean
  className?: string
}

export function TabTransition({ children, isActive, className }: TabTransitionProps) {
  const [shouldRender, setShouldRender] = React.useState(isActive)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    if (isActive) {
      setShouldRender(true)
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 200) // Match exit animation duration

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isActive 
          ? "opacity-100 transform translate-y-0" 
          : "opacity-0 transform -translate-y-2",
        className
      )}
    >
      {children}
    </div>
  )
}

interface StaggeredTransitionProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggeredTransition({ 
  children, 
  className, 
  staggerDelay = 100 
}: StaggeredTransitionProps) {
  const [visibleItems, setVisibleItems] = React.useState<number[]>([])

  React.useEffect(() => {
    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, index * staggerDelay)

      return () => clearTimeout(timer)
    })
  }, [children, staggerDelay])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 ease-out",
            visibleItems.includes(index)
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-4"
          )}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
