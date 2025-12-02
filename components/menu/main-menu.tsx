"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DIFFICULTIES } from "@/lib/constants"
import type { DifficultySettings } from "@/lib/types"

interface MainMenuProps {
  onSelectDifficulty: (difficulty: DifficultySettings) => void
  onCustom: () => void
  onMultiplayer: () => void
}

export function MainMenu({ onSelectDifficulty, onCustom, onMultiplayer }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-primary">Stroop 效应测试</CardTitle>
          <p className="text-center text-muted-foreground mt-2">选择文字的颜色，而不是文字的内容</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 难度选择 */}
          <div className="space-y-3">
            {Object.entries(DIFFICULTIES).map(([name, settings]) => (
              <Button
                key={name}
                variant="outline"
                className="w-full h-14 text-lg justify-between bg-transparent"
                onClick={() => onSelectDifficulty(settings)}
              >
                <span>{name}</span>
                <span className="text-sm text-muted-foreground">
                  {settings.optionsCount}选项 / {settings.timer}秒
                </span>
              </Button>
            ))}

            <Button variant="outline" className="w-full h-14 text-lg bg-transparent" onClick={onCustom}>
              ⚙️ 自定义设置
            </Button>
          </div>

          {/* 多人模式 */}
          <Button
            variant="default"
            className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600"
            onClick={onMultiplayer}
          >
            🎮 局域网对战
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
