"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { DifficultySettings } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SettingsMenuProps {
  settings: DifficultySettings
  onSettingsChange: (settings: DifficultySettings) => void
  onStart: () => void
  onBack: () => void
}

export function SettingsMenu({ settings, onSettingsChange, onStart, onBack }: SettingsMenuProps) {
  const optionCounts = [3, 6, 9] as const
  const timerOptions = [2, 3, 4, 5]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">自定义设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 选项数量 */}
          <div className="space-y-2">
            <Label>选项数量</Label>
            <div className="flex gap-2">
              {optionCounts.map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  className={cn("flex-1", settings.optionsCount === count && "border-primary border-2")}
                  onClick={() => onSettingsChange({ ...settings, optionsCount: count })}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>

          {/* 倒计时 */}
          <div className="space-y-2">
            <Label>倒计时（秒）</Label>
            <div className="flex gap-2">
              {timerOptions.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn("flex-1", settings.timer === time && "border-primary border-2")}
                  onClick={() => onSettingsChange({ ...settings, timer: time })}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* 干扰模式 */}
          <div className="space-y-2">
            <Label>背景干扰</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn("flex-1", settings.distractions && "border-primary border-2")}
                onClick={() => onSettingsChange({ ...settings, distractions: true })}
              >
                开启
              </Button>
              <Button
                variant="outline"
                className={cn("flex-1", !settings.distractions && "border-primary border-2")}
                onClick={() => onSettingsChange({ ...settings, distractions: false })}
              >
                关闭
              </Button>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onBack}>
              返回
            </Button>
            <Button className="flex-1" onClick={onStart}>
              开始游戏
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
