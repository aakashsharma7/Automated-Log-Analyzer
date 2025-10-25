'use client'

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'

interface ToastProps {
  id: string
  message: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
  title?: string
  variant?: "default" | "glass" | "frosted" | "crystal" | "aurora"
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  default: <Info className="w-5 h-5 text-slate-400" />,
}

const variantClasses = {
  default: "glass-notification",
  glass: "glass-premium",
  frosted: "glass-frosted",
  crystal: "glass-crystal",
  aurora: "glass-aurora"
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'default',
  duration = 5000,
  onClose,
  title,
  variant = "default"
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isExiting, setIsExiting] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      handleClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 pr-10 rounded-2xl shadow-2xl transition-all duration-500 ease-out",
        variantClasses[variant],
        "text-slate-100 hover-soft-lift",
        isExiting 
          ? "opacity-0 translate-x-full scale-95" 
          : "opacity-100 translate-x-0 scale-100",
        type === 'success' && "border-green-500/30",
        type === 'error' && "border-red-500/30",
        type === 'info' && "border-blue-500/30",
        type === 'warning' && "border-yellow-500/30",
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-white mb-1 font-outfit">
            {title}
          </h4>
        )}
        <p className="text-sm text-slate-200 font-poppins leading-relaxed">
          {message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200 hover-soft-scale"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number, title?: string, variant?: ToastProps['variant']) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined) as React.Context<ToastContextType | undefined>

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((
    message: string, 
    type: ToastType = 'default', 
    duration: number = 5000,
    title?: string,
    variant: ToastProps['variant'] = 'default'
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration, onClose: removeToast, title, variant }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
