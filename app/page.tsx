"use client"

import { useState, useCallback, useEffect } from "react"
import { MainMenu } from "@/components/menu/main-menu"
import { SettingsMenu } from "@/components/menu/settings-menu"
import { SinglePlayerGame } from "@/components/game/single-player-game"
import { GameOver } from "@/components/game/game-over"
import { MultiplayerMenu } from "@/components/multiplayer/multiplayer-menu"
import { HostGame } from "@/components/multiplayer/host-game"
import { JoinGame } from "@/components/multiplayer/join-game"
import { MultiplayerGame } from "@/components/multiplayer/multiplayer-game"
import { MultiplayerResult } from "@/components/multiplayer/multiplayer-result"
import { useGameState } from "@/hooks/use-game-state"
import { useMultiplayer } from "@/hooks/use-multiplayer"
import { WIN_SCORE } from "@/lib/constants"

export default function StroopGame() {
  const {
    gameState,
    setGameState,
    difficulty,
    customSettings,
    setCustomSettings,
    singlePlayer,
    stats,
    startGame,
    handleAnswer,
    handleTimeout,
    nextQuestion,
    endGame,
    goToMenu,
  } = useGameState()

  const multiplayer = useMultiplayer()
  const [joinError, setJoinError] = useState("")

  // 主菜单处理
  const handleSelectDifficulty = useCallback(
    (diff: typeof difficulty) => {
      startGame(diff)
    },
    [startGame],
  )

  const handleCustom = useCallback(() => {
    setGameState("settings")
  }, [setGameState])

  const handleMultiplayer = useCallback(() => {
    setGameState("multiplayer-menu")
  }, [setGameState])

  // 设置菜单处理
  const handleStartCustom = useCallback(() => {
    startGame(customSettings)
  }, [startGame, customSettings])

  // 多人游戏处理
  const handleHostGame = useCallback(() => {
    multiplayer.createRoom()
    setGameState("multiplayer-host")
  }, [multiplayer, setGameState])

  const handleJoinGame = useCallback(() => {
    setGameState("multiplayer-join")
  }, [setGameState])

  const handleJoinRoom = useCallback(
    (roomId: string) => {
      const success = multiplayer.joinRoom(roomId)
      if (success) {
        setJoinError("")
      } else {
        setJoinError("无法连接到房间，请检查房间号")
      }
    },
    [multiplayer],
  )

  const handleStartMultiplayer = useCallback(() => {
    multiplayer.startGame()
    setGameState("multiplayer-game")
  }, [multiplayer, setGameState])

  const handleMultiplayerBack = useCallback(() => {
    multiplayer.cleanup()
    setGameState("multiplayer-menu")
  }, [multiplayer, setGameState])

  const handleMultiplayerMenuBack = useCallback(() => {
    goToMenu()
  }, [goToMenu])

  useEffect(() => {
    if (multiplayer.gameStarted && gameState === "multiplayer-join") {
      setGameState("multiplayer-game")
    }
  }, [multiplayer.gameStarted, gameState, setGameState])

  useEffect(() => {
    if (multiplayer.connectionError) {
      setJoinError(multiplayer.connectionError)
    }
  }, [multiplayer.connectionError])

  // 检查多人游戏是否结束
  const checkMultiplayerGameOver =
    multiplayer.gameData.myScore >= WIN_SCORE || multiplayer.gameData.opponentScore >= WIN_SCORE

  // 渲染当前状态
  switch (gameState) {
    case "main-menu":
      return (
        <MainMenu
          onSelectDifficulty={handleSelectDifficulty}
          onCustom={handleCustom}
          onMultiplayer={handleMultiplayer}
        />
      )

    case "settings":
      return (
        <SettingsMenu
          settings={customSettings}
          onSettingsChange={setCustomSettings}
          onStart={handleStartCustom}
          onBack={goToMenu}
        />
      )

    case "game-play":
      return (
        <SinglePlayerGame
          difficulty={difficulty}
          gameState={singlePlayer}
          onAnswer={handleAnswer}
          onTimeout={handleTimeout}
          onNextQuestion={nextQuestion}
          onEndGame={endGame}
        />
      )

    case "game-over":
      return stats ? <GameOver stats={stats} onRestart={() => startGame(difficulty)} onMenu={goToMenu} /> : null

    case "multiplayer-menu":
      return <MultiplayerMenu onHost={handleHostGame} onJoin={handleJoinGame} onBack={handleMultiplayerMenuBack} />

    case "multiplayer-host":
      return (
        <HostGame
          roomId={multiplayer.roomId}
          connected={multiplayer.connected}
          onStart={handleStartMultiplayer}
          onBack={handleMultiplayerBack}
          error={multiplayer.connectionError}
        />
      )

    case "multiplayer-join":
      return (
        <JoinGame
          onJoin={handleJoinRoom}
          onBack={handleMultiplayerBack}
          error={joinError}
          connected={multiplayer.connected}
          waitingForStart={multiplayer.connected && !multiplayer.gameStarted}
        />
      )

    case "multiplayer-game":
      if (checkMultiplayerGameOver) {
        const results = multiplayer.getResults()
        return (
          <MultiplayerResult
            myScore={results.myScore}
            opponentScore={results.opponentScore}
            stats={results}
            onMenu={() => {
              multiplayer.cleanup()
              goToMenu()
            }}
          />
        )
      }
      return (
        <MultiplayerGame gameData={multiplayer.gameData} options={multiplayer.options} onAnswer={multiplayer.answer} />
      )

    default:
      return (
        <MainMenu
          onSelectDifficulty={handleSelectDifficulty}
          onCustom={handleCustom}
          onMultiplayer={handleMultiplayer}
        />
      )
  }
}
