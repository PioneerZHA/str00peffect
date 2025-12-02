"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MultiplayerResultProps {
  myScore: number
  opponentScore: number
  stats: {
    correct: number
    total: number
    percentage: number
    avgTime: number
    minTime: number
  }
  onMenu: () => void
}

export function MultiplayerResult({ myScore, opponentScore, stats, onMenu }: MultiplayerResultProps) {
  const isWinner = myScore > opponentScore
  const isDraw = myScore === opponentScore

  const getResultText = () => {
    if (isDraw) return "平局！"
    return isWinner ? "你赢了！" : "你输了！"
  }

  const getResultColor = () => {
    if (isDraw) return "text-blue-600"
    return isWinner ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">对战结束</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 结果 */}
          <div className="text-center">
            <p className={cn("text-4xl font-bold", getResultColor())}>{getResultText()}</p>
          </div>

          {/* 分数 */}
          <div className="text-center text-2xl">
            <span className="text-blue-600 font-bold">{myScore}</span>
            <span className="mx-4 text-muted-foreground">vs</span>
            <span className="text-red-600 font-bold">{opponentScore}</span>
          </div>

          {/* 统计 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">正确率</span>
              <span>
                {stats.correct} / {stats.total} ({stats.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">平均反应时间</span>
              <span>{stats.avgTime.toFixed(2)}秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">最快反应时间</span>
              <span className="text-green-600">{stats.minTime.toFixed(2)}秒</span>
            </div>
          </div>

          {/* 按钮 */}
          <Button className="w-full h-14 text-lg" onClick={onMenu}>
            返回主菜单
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
