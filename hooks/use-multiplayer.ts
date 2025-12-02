"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { MultiplayerGameData, GamePhase, MessageType } from "@/lib/types"
import { PHASE_CONFIG, QUESTION_TIME, WIN_SCORE } from "@/lib/constants"
import { generateQuestion, generateOptions, calculateStats } from "@/lib/game-utils"

interface MultiplayerMessage {
  type: MessageType
  [key: string]: unknown
}

const initialGameData: MultiplayerGameData = {
  phase: 1,
  myScore: 0,
  opponentScore: 0,
  remainingTime: QUESTION_TIME,
  question: null,
  showFeedback: false,
  feedbackText: "",
  feedbackCorrect: false,
  questionsLeft: 5,
  myAnswered: false,
  opponentAnswered: false,
  myAnswerCorrect: false,
  opponentAnswerCorrect: false,
  reactionTimes: [],
}

export function useMultiplayer() {
  const [isHost, setIsHost] = useState(false)
  const [connected, setConnected] = useState(false)
  const [roomId, setRoomId] = useState<string>("")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameData, setGameData] = useState<MultiplayerGameData>(initialGameData)
  const [options, setOptions] = useState<string[]>([])
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [connectionError, setConnectionError] = useState<string>("")

  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createClient())
  const myIdRef = useRef<string>(Math.random().toString(36).substring(2, 10))

  // 处理接收到的消息
  const handleMessage = useCallback((payload: { type: string; event: string; payload: MultiplayerMessage }) => {
    const msg = payload.payload

    // 忽略自己发送的消息
    if (msg.senderId === myIdRef.current) return

    switch (msg.type) {
      case "ready":
        setConnected(true)
        break

      case "start":
        const seed = msg.seed as number
        const question = generateQuestion(seed)
        const opts = generateOptions(question.correctAnswer, PHASE_CONFIG[1].options)

        setGameData({
          ...initialGameData,
          question,
          remainingTime: QUESTION_TIME,
        })
        setOptions(opts)
        setQuestionStartTime(Date.now())
        setGameStarted(true)
        break

      case "answer":
        setGameData((prev) => {
          const points = PHASE_CONFIG[prev.phase].points
          const correct = msg.correct as boolean

          return {
            ...prev,
            opponentAnswered: true,
            opponentAnswerCorrect: correct,
            opponentScore: correct ? prev.opponentScore + points : Math.max(0, prev.opponentScore - points),
          }
        })
        break

      case "correct_answer":
        // 对方答对了，准备下一题
        setGameData((prev) => ({
          ...prev,
          showFeedback: true,
          feedbackText: "对方抢答正确！",
          feedbackCorrect: false,
        }))
        break

      case "next_question":
        const nextSeed = msg.seed as number
        const nextQuestion = generateQuestion(nextSeed)

        setGameData((prev) => {
          let newPhase = prev.phase
          let questionsLeft = prev.questionsLeft - 1

          // 检查是否需要切换阶段
          if (questionsLeft <= 0 && prev.phase < 3) {
            newPhase = (prev.phase + 1) as GamePhase
            questionsLeft = PHASE_CONFIG[newPhase].questions
          }

          const newOpts = generateOptions(nextQuestion.correctAnswer, PHASE_CONFIG[newPhase].options)
          setOptions(newOpts)

          return {
            ...prev,
            phase: newPhase,
            question: nextQuestion,
            questionsLeft,
            showFeedback: false,
            feedbackText: "",
            myAnswered: false,
            opponentAnswered: false,
            myAnswerCorrect: false,
            opponentAnswerCorrect: false,
            remainingTime: QUESTION_TIME,
          }
        })
        setQuestionStartTime(Date.now())
        break

      case "game_end":
        // 游戏结束
        break
    }
  }, [])

  const createRoom = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(id)
    setIsHost(true)
    setConnectionError("")

    const supabase = supabaseRef.current
    const channel = supabase.channel(`stroop-game-${id}`, {
      config: {
        broadcast: {
          self: false, // 不接收自己的消息
        },
      },
    })

    channel.on("broadcast", { event: "game-message" }, handleMessage).subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("[v0] Host subscribed to channel:", id)
      } else if (status === "CHANNEL_ERROR") {
        setConnectionError("连接失败，请重试")
      }
    })

    channelRef.current = channel
    return id
  }, [handleMessage])

  const joinRoom = useCallback(
    (id: string) => {
      setRoomId(id)
      setIsHost(false)
      setConnectionError("")

      const supabase = supabaseRef.current
      const channel = supabase.channel(`stroop-game-${id}`, {
        config: {
          broadcast: {
            self: false,
          },
        },
      })

      channel.on("broadcast", { event: "game-message" }, handleMessage).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[v0] Client subscribed to channel:", id)
          // 发送加入消息
          channel.send({
            type: "broadcast",
            event: "game-message",
            payload: { type: "ready", senderId: myIdRef.current },
          })
          setConnected(true)
        } else if (status === "CHANNEL_ERROR") {
          setConnectionError("无法连接到房间，请检查房间号")
        }
      })

      channelRef.current = channel
      return true
    },
    [handleMessage],
  )

  const sendMessage = useCallback((msg: MultiplayerMessage) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "game-message",
        payload: { ...msg, senderId: myIdRef.current },
      })
    }
  }, [])

  // 开始游戏（主机调用）
  const startGame = useCallback(() => {
    if (!isHost) return

    const seed = Date.now()
    const question = generateQuestion(seed)
    const opts = generateOptions(question.correctAnswer, PHASE_CONFIG[1].options)

    sendMessage({ type: "start", seed })

    setGameData({
      ...initialGameData,
      question,
      remainingTime: QUESTION_TIME,
    })
    setOptions(opts)
    setQuestionStartTime(Date.now())
    setGameStarted(true)
  }, [isHost, sendMessage])

  // 回答问题
  const answer = useCallback(
    (selectedAnswer: string) => {
      if (gameData.myAnswered || !gameData.question) return

      const reactionTime = (Date.now() - questionStartTime) / 1000
      const isCorrect = selectedAnswer === gameData.question.correctAnswer
      const points = PHASE_CONFIG[gameData.phase].points

      setGameData((prev) => ({
        ...prev,
        myAnswered: true,
        myAnswerCorrect: isCorrect,
        myScore: isCorrect ? prev.myScore + points : Math.max(0, prev.myScore - points),
        showFeedback: !isCorrect,
        feedbackText: isCorrect ? "" : `错误！正确答案是 ${prev.question?.correctAnswer}`,
        feedbackCorrect: isCorrect,
        reactionTimes: [...prev.reactionTimes, reactionTime],
      }))

      sendMessage({ type: "answer", correct: isCorrect })

      if (isCorrect) {
        sendMessage({ type: "correct_answer" })
        // 准备下一题
        setTimeout(() => {
          const seed = Date.now()
          sendMessage({ type: "next_question", seed })
          // 本地也处理下一题
          const nextQuestion = generateQuestion(seed)

          setGameData((prev) => {
            let newPhase = prev.phase
            let questionsLeft = prev.questionsLeft - 1

            if (questionsLeft <= 0 && prev.phase < 3) {
              newPhase = (prev.phase + 1) as GamePhase
              questionsLeft = PHASE_CONFIG[newPhase].questions
            }

            const newOpts = generateOptions(nextQuestion.correctAnswer, PHASE_CONFIG[newPhase].options)
            setOptions(newOpts)

            return {
              ...prev,
              phase: newPhase,
              question: nextQuestion,
              questionsLeft,
              showFeedback: false,
              feedbackText: "",
              myAnswered: false,
              opponentAnswered: false,
              myAnswerCorrect: false,
              opponentAnswerCorrect: false,
              remainingTime: QUESTION_TIME,
            }
          })
          setQuestionStartTime(Date.now())
        }, 500)
      }
    },
    [gameData, questionStartTime, sendMessage],
  )

  // 超时处理
  const handleTimeout = useCallback(() => {
    if (gameData.myAnswered) return

    const points = PHASE_CONFIG[gameData.phase].points

    setGameData((prev) => ({
      ...prev,
      myAnswered: true,
      myAnswerCorrect: false,
      myScore: Math.max(0, prev.myScore - points),
      showFeedback: true,
      feedbackText: `超时！正确答案是 ${prev.question?.correctAnswer}`,
      reactionTimes: [...prev.reactionTimes, QUESTION_TIME],
    }))

    sendMessage({ type: "answer", correct: false, timeout: true })
  }, [gameData, sendMessage])

  // 更新剩余时间
  useEffect(() => {
    if (!gameData.question || gameData.myAnswered || !gameStarted) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - questionStartTime) / 1000
      const remaining = Math.max(0, QUESTION_TIME - elapsed)

      setGameData((prev) => ({ ...prev, remainingTime: remaining }))

      if (remaining <= 0) {
        handleTimeout()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [questionStartTime, gameData.question, gameData.myAnswered, gameStarted, handleTimeout])

  // 检查获胜条件
  const isGameOver = gameData.myScore >= WIN_SCORE || gameData.opponentScore >= WIN_SCORE

  // 获取游戏结果
  const getResults = useCallback(() => {
    const stats = calculateStats(
      gameData.reactionTimes.filter((_, i) => true).length,
      gameData.reactionTimes.length,
      gameData.reactionTimes,
    )

    return {
      ...stats,
      myScore: gameData.myScore,
      opponentScore: gameData.opponentScore,
    }
  }, [gameData])

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabaseRef.current.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setConnected(false)
    setRoomId("")
    setGameData(initialGameData)
    setGameStarted(false)
    setConnectionError("")
  }, [])

  return {
    isHost,
    connected,
    roomId,
    gameData,
    options,
    isGameOver,
    gameStarted,
    connectionError,
    createRoom,
    joinRoom,
    startGame,
    answer,
    handleTimeout,
    getResults,
    cleanup,
  }
}
