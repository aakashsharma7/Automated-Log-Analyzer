import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"

interface NotificationProps {
  type?: "success" | "error" | "warning" | "info"
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  className?: string
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    titleColor: "text-green-200"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500/10", 
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    titleColor: "text-red-200"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30", 
    iconColor: "text-yellow-400",
    titleColor: "text-yellow-200"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400", 
    titleColor: "text-blue-200"
  }
}

export function Notification({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isExiting, setIsExiting] = React.useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "glass-notification border rounded-2xl p-4 shadow-2xl transition-all duration-500 transform hover-soft-lift",
        config.bgColor,
        config.borderColor,
        isExiting 
          ? "animate-slide-out-right opacity-0 scale-95" 
          : "animate-slide-in-right opacity-100 scale-100",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn("text-sm font-semibold mb-1", config.titleColor)}>
              {title}
            </h4>
          )}
          <p className="text-sm text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
          </button>
        )}
      </div>
    </div>
  )
}

export function NotificationContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {children}
    </div>
  )
}

export function useNotification() {
  const [notifications, setNotifications] = React.useState<Array<NotificationProps & { id: string }>>([])

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id)
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const success = (message: string, title?: string) => 
    addNotification({ type: "success", message, title })
  
  const error = (message: string, title?: string) => 
    addNotification({ type: "error", message, title })
  
  const warning = (message: string, title?: string) => 
    addNotification({ type: "warning", message, title })
  
  const info = (message: string, title?: string) => 
    addNotification({ type: "info", message, title })

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}

export function AnimatedBadge({
  children,
  variant = "default",
  size = "md",
  className
}: {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "premium"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const variantClasses = {
    default: "bg-slate-700 text-slate-200 border-slate-600",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    error: "bg-red-500/20 text-red-300 border-red-500/30", 
    premium: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all duration-300 hover:scale-105 animate-scale-in-bounce",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
