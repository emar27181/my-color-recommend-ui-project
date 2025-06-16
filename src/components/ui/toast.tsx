import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error"
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          {
            "border-border bg-background text-foreground": variant === "default",
            "border-green-200 bg-green-50 text-green-800": variant === "success",
            "border-red-200 bg-red-50 text-red-800": variant === "error",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast"

export { Toast }