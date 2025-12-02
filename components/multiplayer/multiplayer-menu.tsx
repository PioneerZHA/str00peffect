"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MultiplayerMenuProps {
  onHost: () => void
  onJoin: () => void
  onBack: () => void
}

export function MultiplayerMenu({ onHost, onJoin, onBack }: MultiplayerMenuProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">在线对战</CardTitle>
          <p className="text-center text-muted-foreground">与全球玩家实时对战</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="default" className="w-full h-14 text-lg bg-green-600 hover:bg-green-700" onClick={onHost}>
            创建房间
          </Button>
          <Button variant="outline" className="w-full h-14 text-lg bg-transparent" onClick={onJoin}>
            加入房间
          </Button>
          <Button variant="ghost" className="w-full" onClick={onBack}>
            ← 返回主菜单
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
