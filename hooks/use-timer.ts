"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useTimer(duration: number, onTimeout: () => void, paused = false) {
  const [remaining, setRemaining] = useState(duration)
  const startTimeRef = useRef<number>(Date.now())
  const onTimeoutRef = useRef(onTimeout)

  // 更新回调引用
  onTimeoutRef.current = onTimeout

  // 重置计时器
  const reset = useCallback(() => {
    startTimeRef.current = Date.now()
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const newRemaining = Math.max(0, duration - elapsed)
      setRemaining(newRemaining)

      if (newRemaining <= 0) {
        onTimeoutRef.current()
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration, paused])

  return { remaining, reset, progress: remaining / duration }
}
