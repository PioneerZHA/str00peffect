"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameStats } from "@/lib/types"

interface GameOverProps {
  stats: GameStats
  onRestart: () => void
  onMenu: () => void
}

export function GameOver({ stats, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">测试结束</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 统计数据 */}
          <div className="space-y-4 text-center">
            <div className="text-2xl">
              正确率: <span className="font-bold text-primary">{stats.correct}</span> / {stats.total} (
              {stats.percentage.toFixed(1)}%)
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-muted-foreground">平均时间</div>
                <div className="font-semibold">{stats.avgTime.toFixed(2)}秒</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-muted-foreground">最快</div>
                <div className="font-semibold text-green-600">{stats.minTime.toFixed(2)}秒</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-muted-foreground">最慢</div>
                <div className="font-semibold text-red-600">{stats.maxTime.toFixed(2)}秒</div>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4">
            <Button onClick={onRestart} className="flex-1" variant="default">
              再次挑战
            </Button>
            <Button onClick={onMenu} className="flex-1 bg-transparent" variant="outline">
              返回菜单
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
