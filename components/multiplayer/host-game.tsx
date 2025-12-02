"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HostGameProps {
  roomId: string
  connected: boolean
  onStart: () => void
  onBack: () => void
  error?: string
}

export function HostGame({ roomId, connected, onStart, onBack, error }: HostGameProps) {
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">创建房间</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 房间ID */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">房间号</p>
            <div
              className="text-4xl font-bold font-mono tracking-widest text-primary cursor-pointer hover:opacity-80 transition-opacity"
              onClick={copyRoomId}
              title="点击复制"
            >
              {roomId}
            </div>
            <p className="text-sm text-muted-foreground">分享此房间号给朋友，让他们加入游戏</p>
            <Button variant="outline" size="sm" onClick={copyRoomId}>
              复制房间号
            </Button>
          </div>

          {/* 错误信息 */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* 连接状态 */}
          <div className="flex justify-center">
            {connected ? (
              <Badge variant="default" className="text-lg px-4 py-2 bg-green-600">
                玩家已连接
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-lg px-4 py-2 animate-pulse">
                等待玩家加入...
              </Badge>
            )}
          </div>

          {/* 按钮 */}
          <div className="space-y-3">
            {connected && (
              <Button className="w-full h-14 text-lg" onClick={onStart}>
                开始游戏
              </Button>
            )}
            <Button variant="ghost" className="w-full" onClick={onBack}>
              ← 返回
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
