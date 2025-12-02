"use client"

import { Button } from "@/components/ui/button"
import { getDistractionColor } from "@/lib/game-utils"
import { cn } from "@/lib/utils"

interface AnswerButtonsProps {
  options: string[]
  onAnswer: (answer: string) => void
  disabled?: boolean
  distractions?: boolean
}

export function AnswerButtons({ options, onAnswer, disabled = false, distractions = false }: AnswerButtonsProps) {
  const getGridCols = () => {
    if (options.length <= 3) return "grid-cols-3"
    if (options.length <= 6) return "grid-cols-3"
    return "grid-cols-3"
  }

  return (
    <div className={cn("grid gap-3 max-w-lg mx-auto", getGridCols())}>
      {options.map((option) => {
        const bgColor = distractions ? getDistractionColor(option) : undefined

        return (
          <Button
            key={option}
            variant="outline"
            size="lg"
            className={cn(
              "h-14 text-lg font-medium transition-all",
              "hover:scale-105 hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            style={bgColor ? { backgroundColor: bgColor, color: "#000" } : undefined}
            onClick={() => !disabled && onAnswer(option)}
            disabled={disabled}
          >
            {option}
          </Button>
        )
      })}
    </div>
  )
}
