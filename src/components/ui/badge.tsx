import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "term-badge inline-flex items-center gap-1",
  {
    variants: {
      variant: {
        default:     "term-badge-yellow",
        secondary:   "term-badge-dim",
        destructive: "term-badge-red",
        outline:     "term-badge-dim",
        success:     "term-badge-green",
        info:        "term-badge-blue",
        warning:     "term-badge-yellow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
