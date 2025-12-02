import type { DifficultySettings } from "./types"

// 颜色定义
export const COLORS: Record<string, string> = {
  红色: "#FF0000",
  绿色: "#00C800",
  蓝色: "#0000FF",
  黄色: "#FFD700",
  紫色: "#A020F0",
  橙色: "#FFA500",
  青色: "#00FFFF",
  粉色: "#FF69B4",
  棕色: "#A52A2A",
}

export const COLOR_NAMES = Object.keys(COLORS)

// 难度预设
export const DIFFICULTIES: Record<string, DifficultySettings> = {
  简单: { name: "简单", optionsCount: 3, timer: 4, distractions: false },
  中等: { name: "中等", optionsCount: 6, timer: 3, distractions: false },
  困难: { name: "困难", optionsCount: 9, timer: 2, distractions: true },
}

// 多人游戏阶段配置
export const PHASE_CONFIG = {
  1: { questions: 5, options: 3, distractions: false, points: 1 },
  2: { questions: 5, options: 6, distractions: false, points: 2 },
  3: { questions: Number.POSITIVE_INFINITY, options: 9, distractions: true, points: 3 },
} as const

// 游戏常量
export const QUESTION_TIME = 5 // 每题时间（秒）
export const TOTAL_QUESTIONS = 20 // 单人模式总题数
export const WIN_SCORE = 10 // 多人模式获胜分数
