import * as React from "react"
import { Slot } from "@/lib/radix-ui-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover-soft-scale active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 animate-gradient-shift hover-glow-soft",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-pink-700 hover-pulse-glow",
        outline:
          "border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800/50 hover:text-white hover:border-slate-500 shadow-sm hover:shadow-md hover-border-glow",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-sm hover:shadow-md hover-soft-lift",
        ghost: "text-slate-300 hover:bg-slate-800/50 hover:text-white hover-soft-scale",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 hover-glow-soft",
        premium: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-xl hover:shadow-2xl hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 animate-gradient-shift hover-glow-gradient",
        success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 hover-soft-lift",
        warning: "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg hover:shadow-xl hover:from-yellow-700 hover:to-orange-700 hover-bounce-soft",
        glass: "glass-premium text-slate-200 hover:text-white hover:bg-white/10 hover-shimmer",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as any)}
        />
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
