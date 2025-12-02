"use client"

interface ScoreDisplayProps {
  score: number
  total: number
  label?: string
}

export function ScoreDisplay({ score, total, label = "得分" }: ScoreDisplayProps) {
  return (
    <div className="text-lg font-semibold">
      {label}: <span className="text-primary">{score}</span> / {total}
    </div>
  )
}
