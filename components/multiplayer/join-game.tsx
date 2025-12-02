"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface JoinGameProps {
  onJoin: (roomId: string) => void
  onBack: () => void
  error?: string
  connected?: boolean
  waitingForStart?: boolean
}

export function JoinGame({ onJoin, onBack, error, connected, waitingForStart }: JoinGameProps) {
  const [roomId, setRoomId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId.trim()) {
      onJoin(roomId.trim().toUpperCase())
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">加入房间</CardTitle>
        </CardHeader>
        <CardContent>
          {waitingForStart ? (
            <div className="space-y-6 text-center">
              <Badge variant="default" className="text-lg px-4 py-2 bg-green-600">
                已连接到房间
              </Badge>
              <p className="text-muted-foreground animate-pulse">等待房主开始游戏...</p>
              <Button variant="ghost" className="w-full" onClick={onBack}>
                ← 返回
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roomId">房间号</Label>
                <Input
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="输入6位房间号"
                  className="text-center text-2xl font-mono tracking-widest h-14"
                  maxLength={6}
                  autoComplete="off"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="space-y-3">
                <Button type="submit" className="w-full h-14 text-lg" disabled={roomId.length < 6}>
                  连接
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
                  ← 返回
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
