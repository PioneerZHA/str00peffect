"use client"

import { useState, useCallback } from "react"
import type { GameState, DifficultySettings, GameStats, Question } from "@/lib/types"
import { DIFFICULTIES } from "@/lib/constants"
import { generateQuestion, generateOptions, calculateStats } from "@/lib/game-utils"

export interface SinglePlayerState {
  score: number
  total: number
  question: Question | null
  options: string[]
  showFeedback: boolean
  feedbackText: string
  feedbackCorrect: boolean
  reactionTimes: number[]
  questionStartTime: number
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>("main-menu")
  const [difficulty, setDifficulty] = useState<DifficultySettings>(DIFFICULTIES["简单"])
  const [customSettings, setCustomSettings] = useState<DifficultySettings>({
    name: "自定义",
    optionsCount: 6,
    timer: 3,
    distractions: false,
  })

  const [singlePlayer, setSinglePlayer] = useState<SinglePlayerState>({
    score: 0,
    total: 0,
    question: null,
    options: [],
    showFeedback: false,
    feedbackText: "",
    feedbackCorrect: false,
    reactionTimes: [],
    questionStartTime: 0,
  })

  const [stats, setStats] = useState<GameStats | null>(null)

  // 开始新游戏
  const startGame = useCallback((diff: DifficultySettings) => {
    setDifficulty(diff)
    const question = generateQuestion()
    const options = generateOptions(question.correctAnswer, diff.optionsCount)

    setSinglePlayer({
      score: 0,
      total: 0,
      question,
      options,
      showFeedback: false,
      feedbackText: "",
      feedbackCorrect: false,
      reactionTimes: [],
      questionStartTime: Date.now(),
    })
    setGameState("game-play")
  }, [])

  // 处理答案
  const handleAnswer = useCallback((answer: string) => {
    setSinglePlayer((prev) => {
      if (prev.showFeedback || !prev.question) return prev

      const reactionTime = (Date.now() - prev.questionStartTime) / 1000
      const isCorrect = answer === prev.question.correctAnswer

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        total: prev.total + 1,
        showFeedback: true,
        feedbackText: isCorrect
          ? `✅ 正确！用时: ${reactionTime.toFixed(2)}秒`
          : `❌ 错误！正确答案是 ${prev.question.correctAnswer}`,
        feedbackCorrect: isCorrect,
        reactionTimes: [...prev.reactionTimes, reactionTime],
      }
    })
  }, [])

  // 超时处理
  const handleTimeout = useCallback(() => {
    setSinglePlayer((prev) => {
      if (prev.showFeedback || !prev.question) return prev

      return {
        ...prev,
        total: prev.total + 1,
        showFeedback: true,
        feedbackText: `⏰ 超时！正确答案是 ${prev.question.correctAnswer}`,
        feedbackCorrect: false,
        reactionTimes: [...prev.reactionTimes, difficulty.timer],
      }
    })
  }, [difficulty.timer])

  // 下一题
  const nextQuestion = useCallback(() => {
    setSinglePlayer((prev) => {
      const question = generateQuestion()
      const options = generateOptions(question.correctAnswer, difficulty.optionsCount)

      return {
        ...prev,
        question,
        options,
        showFeedback: false,
        feedbackText: "",
        feedbackCorrect: false,
        questionStartTime: Date.now(),
      }
    })
  }, [difficulty.optionsCount])

  // 结束游戏
  const endGame = useCallback(() => {
    const gameStats = calculateStats(singlePlayer.score, singlePlayer.total, singlePlayer.reactionTimes)
    setStats(gameStats)
    setGameState("game-over")
  }, [singlePlayer])

  // 返回主菜单
  const goToMenu = useCallback(() => {
    setGameState("main-menu")
    setStats(null)
  }, [])

  return {
    gameState,
    setGameState,
    difficulty,
    setDifficulty,
    customSettings,
    setCustomSettings,
    singlePlayer,
    stats,
    startGame,
    handleAnswer,
    handleTimeout,
    nextQuestion,
    endGame,
    goToMenu,
  }
}
