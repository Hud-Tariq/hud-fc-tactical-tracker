import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur px-3 py-2 text-base text-white ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
