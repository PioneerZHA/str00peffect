import { COLORS, COLOR_NAMES } from "./constants"
import type { Question } from "./types"

// 获取颜色名称
export function getColorNameByHex(hex: string): string {
  for (const [name, value] of Object.entries(COLORS)) {
    if (value.toLowerCase() === hex.toLowerCase()) {
      return name
    }
  }
  return "未知"
}

// 生成随机问题
export function generateQuestion(seed?: number): Question {
  const random = seed !== undefined ? seededRandom(seed) : Math.random

  const wordIndex = Math.floor(random() * COLOR_NAMES.length)
  const colorIndex = Math.floor(random() * COLOR_NAMES.length)

  const word = COLOR_NAMES[wordIndex]
  const fontColorName = COLOR_NAMES[colorIndex]
  const fontColor = COLORS[fontColorName]

  return {
    word,
    fontColor,
    correctAnswer: fontColorName,
  }
}

// 带种子的随机数生成器
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = Math.sin(s) * 10000
    return s - Math.floor(s)
  }
}

// 生成答案选项
export function generateOptions(correctAnswer: string, count: number): string[] {
  const options = [correctAnswer]
  const others = COLOR_NAMES.filter((c) => c !== correctAnswer)

  // 随机选择其他选项
  const shuffled = [...others].sort(() => Math.random() - 0.5)
  options.push(...shuffled.slice(0, count - 1))

  // 打乱顺序
  return options.sort(() => Math.random() - 0.5)
}

// 获取干扰按钮的背景色
export function getDistractionColor(text: string): string {
  const available = COLOR_NAMES.filter((c) => c !== text)
  const randomColor = available[Math.floor(Math.random() * available.length)]
  return COLORS[randomColor]
}

// 计算游戏统计
export function calculateStats(
  correct: number,
  total: number,
  reactionTimes: number[],
): {
  correct: number
  total: number
  percentage: number
  avgTime: number
  minTime: number
  maxTime: number
} {
  const percentage = total > 0 ? (correct / total) * 100 : 0
  const avgTime = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0
  const minTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0
  const maxTime = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0

  return { correct, total, percentage, avgTime, minTime, maxTime }
}
