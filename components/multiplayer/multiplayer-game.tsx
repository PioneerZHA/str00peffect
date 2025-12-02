"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimerBar } from "@/components/game/timer-bar"
import { QuestionDisplay } from "@/components/game/question-display"
import { AnswerButtons } from "@/components/game/answer-buttons"
import type { MultiplayerGameData } from "@/lib/types"
import { PHASE_CONFIG, QUESTION_TIME } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface MultiplayerGameProps {
  gameData: MultiplayerGameData
  options: string[]
  onAnswer: (answer: string) => void
}

export function MultiplayerGame({ gameData, options, onAnswer }: MultiplayerGameProps) {
  const phaseConfig = PHASE_CONFIG[gameData.phase]

  const getPhaseColor = () => {
    switch (gameData.phase) {
      case 1:
        return "text-blue-600"
      case 2:
        return "text-orange-600"
      case 3:
        return "text-red-600"
    }
  }

  const getPhaseDesc = () => {
    switch (gameData.phase) {
      case 1:
        return "5题 / 3选项 / 无干扰 / ±1分"
      case 2:
        return "5题 / 6选项 / 无干扰 / ±2分"
      case 3:
        return "无限题 / 9选项 / 有干扰 / ±3分"
    }
  }

  if (!gameData.question) return null

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* 阶段指示 */}
        <div className="text-center">
          <p className={cn("text-xl font-bold", getPhaseColor())}>阶段 {gameData.phase}</p>
          <p className="text-sm text-muted-foreground">{getPhaseDesc()}</p>
        </div>

        {/* 分数显示 */}
        <div className="flex justify-between items-center">
          <div className="text-lg">
            <span className="text-muted-foreground">我:</span>{" "}
            <span className="font-bold text-blue-600">{gameData.myScore}</span>
          </div>
          <div className="text-lg">
            <span className="text-muted-foreground">对手:</span>{" "}
            <span className="font-bold text-red-600">{gameData.opponentScore}</span>
          </div>
        </div>

        {/* 剩余题目 */}
        {gameData.phase !== 3 && gameData.questionsLeft > 0 && (
          <p className="text-center text-sm text-muted-foreground">剩余题目: {gameData.questionsLeft}</p>
        )}

        {/* 计时器 */}
        <TimerBar remaining={gameData.remainingTime} total={QUESTION_TIME} />

        {/* 问题卡片 */}
        <Card className="p-6">
          <QuestionDisplay
            question={gameData.question}
            showFeedback={gameData.showFeedback}
            feedbackText={gameData.feedbackText}
            feedbackCorrect={gameData.feedbackCorrect}
          />
        </Card>

        {/* 答案按钮 */}
        {!gameData.showFeedback && (
          <AnswerButtons
            options={options}
            onAnswer={onAnswer}
            disabled={gameData.myAnswered}
            distractions={phaseConfig.distractions}
          />
        )}

        {/* 回答状态 */}
        <div className="flex justify-between items-center pt-4">
          {gameData.myAnswered && (
            <Badge variant={gameData.myAnswerCorrect ? "default" : "destructive"}>
              我: {gameData.myAnswerCorrect ? "✓" : "✗"}
            </Badge>
          )}
          {gameData.opponentAnswered && (
            <Badge variant={gameData.opponentAnswerCorrect ? "default" : "destructive"} className="ml-auto">
              对手: {gameData.opponentAnswerCorrect ? "✓" : "✗"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
