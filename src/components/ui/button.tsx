import * as React from "react"
import { Slot } from "@/lib/radix-ui-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ─── Bauhaus Terminal Button System ─── */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-mono text-[11px] font-bold tracking-widest uppercase",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5E642]",
    "disabled:pointer-events-none disabled:opacity-40",
    "border",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Primary — yellow block */
        default:
          "bg-[#F5E642] text-[#080808] border-[#F5E642] hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(245,230,66,0.4)]",

        /* Destructive — red block */
        destructive:
          "bg-[#FF3131] text-white border-[#FF3131] hover:bg-[#CC1A1A] hover:shadow-[0_0_20px_rgba(255,49,49,0.4)]",

        /* Outline — terminal ghost */
        outline:
          "bg-transparent text-[#A8A090] border-[#2C2C2C] hover:border-[#F5E642] hover:text-[#F5E642] hover:bg-[rgba(245,230,66,0.05)]",

        /* Secondary */
        secondary:
          "bg-[#1C1C1C] text-[#A8A090] border-[#2C2C2C] hover:bg-[#242424] hover:text-[#E8E4D0] hover:border-[#3A3A3A]",

        /* Ghost — minimal */
        ghost:
          "bg-transparent text-[#666] border-transparent hover:bg-[#1C1C1C] hover:text-[#E8E4D0] hover:border-[#2C2C2C]",

        /* Link */
        link:
          "bg-transparent text-[#F5E642] border-transparent underline-offset-4 hover:underline hover:text-[#FF8C00]",

        /* Premium — yellow gradient */
        premium:
          "bg-gradient-to-r from-[#F5E642] to-[#FF8C00] text-[#080808] border-transparent hover:shadow-[0_0_24px_rgba(245,230,66,0.4)]",

        /* Success — green outline */
        success:
          "bg-transparent text-[#39FF14] border-[#39FF14] hover:bg-[rgba(57,255,20,0.08)] hover:shadow-[0_0_16px_rgba(57,255,20,0.3)]",

        /* Warning — yellow outline */
        warning:
          "bg-transparent text-[#F5E642] border-[#F5E642] hover:bg-[rgba(245,230,66,0.08)] hover:shadow-[0_0_16px_rgba(245,230,66,0.3)]",

        /* Glass — now bauhaus surface */
        glass:
          "bg-[#141414] text-[#A8A090] border-[#2C2C2C] hover:border-[#3A3A3A] hover:text-[#E8E4D0]",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm:      "h-7 px-3 text-[9px]",
        lg:      "h-10 px-7",
        xl:      "h-12 px-8 text-[12px]",
        icon:    "h-9 w-9",
        "icon-lg": "h-10 w-10",
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
