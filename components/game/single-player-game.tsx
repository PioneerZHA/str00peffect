"use client"

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TimerBar } from "./timer-bar"
import { QuestionDisplay } from "./question-display"
import { AnswerButtons } from "./answer-buttons"
import { ScoreDisplay } from "./score-display"
import { useTimer } from "@/hooks/use-timer"
import type { DifficultySettings } from "@/lib/types"
import { TOTAL_QUESTIONS } from "@/lib/constants"
import type { SinglePlayerState } from "@/hooks/use-game-state"

interface SinglePlayerGameProps {
  difficulty: DifficultySettings
  gameState: SinglePlayerState
  onAnswer: (answer: string) => void
  onTimeout: () => void
  onNextQuestion: () => void
  onEndGame: () => void
}

export function SinglePlayerGame({
  difficulty,
  gameState,
  onAnswer,
  onTimeout,
  onNextQuestion,
  onEndGame,
}: SinglePlayerGameProps) {
  const { remaining, reset, progress } = useTimer(difficulty.timer, onTimeout, gameState.showFeedback)

  // 处理反馈后自动进入下一题
  useEffect(() => {
    if (gameState.showFeedback) {
      const timer = setTimeout(() => {
        if (gameState.total >= TOTAL_QUESTIONS) {
          onEndGame()
        } else {
          onNextQuestion()
          reset()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState.showFeedback, gameState.total, onNextQuestion, onEndGame, reset])

  // 处理答案并重置计时器
  const handleAnswer = useCallback(
    (answer: string) => {
      onAnswer(answer)
    },
    [onAnswer],
  )

  if (!gameState.question) return null

  // 确定是否启用干扰
  const useDistractions = difficulty.distractions && (gameState.total >= 5 || difficulty.name === "自定义")

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between">
          <ScoreDisplay score={gameState.score} total={gameState.total} />
          <Button variant="destructive" size="sm" onClick={onEndGame}>
            结束测试
          </Button>
        </div>

        {/* 计时器 */}
        <TimerBar remaining={remaining} total={difficulty.timer} />

        {/* 问题卡片 */}
        <Card className="p-8">
          <QuestionDisplay
            question={gameState.question}
            showFeedback={gameState.showFeedback}
            feedbackText={gameState.feedbackText}
            feedbackCorrect={gameState.feedbackCorrect}
          />
        </Card>

        {/* 答案按钮 */}
        {!gameState.showFeedback && (
          <AnswerButtons options={gameState.options} onAnswer={handleAnswer} distractions={useDistractions} />
        )}

        {/* 进度提示 */}
        <p className="text-center text-muted-foreground">
          第 {gameState.total + 1} / {TOTAL_QUESTIONS} 题
        </p>
      </div>
    </div>
  )
}
