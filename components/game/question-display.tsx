"use client"

import type { Question } from "@/lib/types"

interface QuestionDisplayProps {
  question: Question
  showFeedback: boolean
  feedbackText: string
  feedbackCorrect: boolean
}

export function QuestionDisplay({ question, showFeedback, feedbackText, feedbackCorrect }: QuestionDisplayProps) {
  if (showFeedback) {
    return (
      <div className="text-center py-8">
        <p className={cn("text-2xl font-bold", feedbackCorrect ? "text-green-600" : "text-red-600")}>{feedbackText}</p>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <p className="text-6xl font-bold mb-6" style={{ color: question.fontColor }}>
        {question.word}
      </p>
      <p className="text-muted-foreground">
        请选择文字的<span className="font-bold">颜色</span>（不是文字的内容）
      </p>
    </div>
  )
}

import { cn } from "@/lib/utils"
