import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export const Slot = React.forwardRef<HTMLDivElement, SlotProps>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild) {
      return React.createElement(React.Fragment, null, children)
    }
    return React.createElement('div', { ref, ...props }, children)
  }
)

Slot.displayName = "Slot"