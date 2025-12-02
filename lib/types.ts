// 游戏状态类型
export type GameState =
  | "main-menu"
  | "settings"
  | "game-play"
  | "game-over"
  | "multiplayer-menu"
  | "multiplayer-host"
  | "multiplayer-join"
  | "multiplayer-game"
  | "multiplayer-result"

// 难度设置
export interface DifficultySettings {
  name: string
  optionsCount: 3 | 6 | 9
  timer: number
  distractions: boolean
}

// 多人游戏阶段
export type GamePhase = 1 | 2 | 3

// 问题数据
export interface Question {
  word: string
  fontColor: string
  correctAnswer: string
}

// 游戏统计
export interface GameStats {
  correct: number
  total: number
  percentage: number
  avgTime: number
  minTime: number
  maxTime: number
}

// 多人游戏数据
export interface MultiplayerGameData {
  phase: GamePhase
  myScore: number
  opponentScore: number
  remainingTime: number
  question: Question | null
  showFeedback: boolean
  feedbackText: string
  feedbackCorrect: boolean
  questionsLeft: number
  myAnswered: boolean
  opponentAnswered: boolean
  myAnswerCorrect: boolean
  opponentAnswerCorrect: boolean
  reactionTimes: number[]
}

// 多人游戏消息类型
export type MessageType =
  | "sync"
  | "answer"
  | "phase_change"
  | "game_end"
  | "ready"
  | "start"
  | "next_question"
  | "correct_answer"
