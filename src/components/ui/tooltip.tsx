import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-lg border border-slate-600 glass-premium px-3 py-1.5 text-sm text-slate-200 shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Enhanced tooltip with animations
interface AnimatedTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

export function AnimatedTooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 300,
  className
}: AnimatedTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn("max-w-xs", className)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Hover card with rich content
interface HoverCardProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
}

export function HoverCard({
  children,
  content,
  side = "top",
  align = "center",
  className
}: HoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div 
            className="inline-block cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "p-4 max-w-sm w-full",
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Floating action button with tooltip
interface FloatingActionButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick?: () => void
  variant?: "default" | "success" | "warning" | "error" | "premium"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function FloatingActionButton({
  icon,
  tooltip,
  onClick,
  variant = "default",
  size = "md",
  className
}: FloatingActionButtonProps) {
  const variantClasses = {
    default: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    error: "bg-red-600 hover:bg-red-700 text-white",
    premium: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
  }

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14"
  }

  return (
    <AnimatedTooltip content={tooltip}>
      <button
        onClick={onClick}
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center z-40",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        {icon}
      </button>
    </AnimatedTooltip>
  )
}
