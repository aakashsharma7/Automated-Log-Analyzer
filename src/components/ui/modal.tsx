'use client'

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  variant?: "default" | "glass" | "frosted" | "crystal" | "aurora"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg", 
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4"
}

const variantClasses = {
  default: "glass-modal",
  glass: "glass-premium",
  frosted: "glass-frosted",
  crystal: "glass-crystal",
  aurora: "glass-aurora"
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className
}: ModalProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "glass-overlay transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl shadow-2xl transition-all duration-300",
          "transform-gpu",
          sizeClasses[size],
          variantClasses[variant],
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold text-white font-outfit">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-slate-400 mt-1 font-poppins">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 hover-soft-scale"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-4 border-t border-white/10", className)}>
      {children}
    </div>
  )
}
