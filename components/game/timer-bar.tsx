"use client"

import { cn } from "@/lib/utils"

interface TimerBarProps {
  remaining: number
  total: number
  className?: string
}

export function TimerBar({ remaining, total, className }: TimerBarProps) {
  const progress = remaining / total

  const getColor = () => {
    if (progress > 0.5) return "bg-green-500"
    if (progress > 0.25) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-100", getColor())}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm font-mono w-16 text-right">{remaining.toFixed(1)}秒</span>
      </div>
    </div>
  )
}
