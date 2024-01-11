import { produce } from 'immer'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSound } from 'use-sound'

import click1Sfx from '@/assets/sounds/click-1.wav?url'
import click2Sfx from '@/assets/sounds/click-2.wav?url'
import click3Sfx from '@/assets/sounds/click-3.wav?url'
import click4Sfx from '@/assets/sounds/click-4.wav?url'
import click5Sfx from '@/assets/sounds/click-5.wav?url'
import clickSfx from '@/assets/sounds/click.wav?url'
import flagFlapSfx from '@/assets/sounds/flag-flap.mp3?url'
import loseSfx from '@/assets/sounds/lose.wav?url'
import positiveClickSfx from '@/assets/sounds/positive-click.wav?url'
import { CellClickFn } from '@/components/Cell/Cell'
import { generateBoard, neighbours } from '@/helpers'

export interface ChangeDifficultyFn {
  (difficulty: Difficulty): void
}
interface GameContext {
  timer: number
  gameStart: boolean
  gameOver: boolean
  flagsCount: number
  board: Array<Array<Cell>>
  difficulty: Difficulty
  volume: number
  highScore: number
  toggleVolume: () => void
  changeDifficulty: ChangeDifficultyFn
  restart: () => void
  onCellChangeMeta: CellClickFn<CellMeta>
  onCellReveal: CellClickFn<number>
  setBoard: React.Dispatch<React.SetStateAction<GameContext['board']>>
}

interface GameProviderProps {
  children: React.ReactNode
}

type GameDifficulty = Record<
  Difficulty,
  {
    width: number
    height: number
    mines: number
  }
>

const GameContext = createContext<GameContext>({
  board: [],
  timer: 0,
  gameOver: false,
  gameStart: false,
  flagsCount: 0,
  volume: 1,
  highScore: 0,
  difficulty: 'medium',
  toggleVolume: () => {},
  changeDifficulty: () => {},
  onCellReveal: () => {},
  onCellChangeMeta: () => {},
  setBoard: () => {},
  restart: () => {},
})

const GAME_DIFFICULTY: GameDifficulty = {
  easy: {
    height: 8,
    width: 10,
    mines: 10,
  },
  medium: {
    height: 14,
    width: 18,
    mines: 40,
  },
  hard: {
    height: 20,
    width: 24,
    mines: 99,
  },
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [gameOver, setGameOver] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [board, setBoard] = useState<GameContext['board']>([])
  const [minesCords, setMinesCords] = useState<Array<Array<number>>>([])
  const [timer, setTimer] = useState(0)
  const [volume, setVolume] = useState(1)
  const [highScore, setHighScore] = useState(0)

  const [click] = useSound(clickSfx, { volume })
  const [click1] = useSound(click1Sfx, { volume })
  const [click2] = useSound(click2Sfx, { volume })
  const [click3] = useSound(click3Sfx, { volume })
  const [click4] = useSound(click4Sfx, { volume })
  const [click5] = useSound(click5Sfx, { volume })
  const [flagFlap] = useSound(flagFlapSfx, { volume })
  const [lose] = useSound(loseSfx, { volume })
  const [positiveClick] = useSound(positiveClickSfx, { volume })

  const valid1DSnapshot = useMemo(
    () => board.flat(1).filter((c) => c.value !== -1),
    [board],
  )

  const soundFxMap = useMemo(
    () => ({
      0: positiveClick,
      1: click,
      2: click1,
      3: click2,
      4: click3,
      5: click4,
      6: click5,
    }),
    [positiveClick, click, click1, click2, click3, click4, click5],
  )

  const flagsCount = useMemo(
    () =>
      minesCords.length - board.flat(1).filter((c) => c.meta === 'mine').length,
    [minesCords, board],
  )

  const handleChangeCellMeta: CellClickFn<CellMeta> = useCallback(
    ([x, y, meta]) => {
      flagFlap()
      setBoard(
        produce((draft) => {
          draft[x][y].meta = meta
        }),
      )
    },
    [flagFlap],
  )

  const onCellReveal: CellClickFn<number> = useCallback(
    ([x, y, value]) => {
      setGameStart(true)

      if (value === -1) {
        setBoard(
          produce((draft) => {
            minesCords.forEach(([mX, mY]) => {
              draft[mX][mY].revealed = true
            })
          }),
        )
        lose()
        setGameOver(true)
        return
      }

      const playFn = soundFxMap[value as keyof typeof soundFxMap]

      if (playFn) {
        playFn()
      }

      setBoard(
        produce((draft) => {
          if (draft[x][y].value !== 0) {
            draft[x][y].revealed = true
            return
          }

          const queue: Array<Cords> = []
          queue.push([x, y])
          draft[x][y].revealed = true

          while (queue.length) {
            const [qX, qY] = queue.shift()!
            neighbours.forEach(([nX, nY]) => {
              if (typeof draft?.[nX + qX]?.[nY + qY] !== 'undefined') {
                if (
                  draft[nX + qX][nY + qY].value === 0 &&
                  !draft[nX + qX][nY + qY].revealed
                ) {
                  queue.push([nX + qX, nY + qY])
                }
                draft[nX + qX][nY + qY].revealed = true
              }
            })
          }
        }),
      )
    },
    [
      minesCords,
      click,
      click1,
      click2,
      click3,
      click4,
      click5,
      positiveClick,
      lose,
    ],
  )

  const handleStartGame = useCallback((diff: Difficulty) => {
    setGameOver(false)
    setGameStart(false)
    const { width, height, mines } = GAME_DIFFICULTY[diff]
    const { board, minesCords } = generateBoard(width, height, mines)
    setBoard(board)
    setMinesCords(minesCords)
    setTimer(0)
  }, [])

  const handleRestart = useCallback(() => {
    handleStartGame(difficulty)
  }, [difficulty])

  const handleChangeDifficulty: ChangeDifficultyFn = useCallback(
    (diff) => {
      setDifficulty(diff)
      handleStartGame(diff)
    },
    [handleStartGame],
  )

  const handleToggleVolume = useCallback(() => {
    setVolume((prev) => (prev ? 0 : 1))
  }, [])

  useEffect(() => {
    if (gameStart) {
      if (valid1DSnapshot.every((c) => c.revealed)) {
        if (!highScore || (highScore && timer < +highScore)) {
          setHighScore(timer)
        }
        setGameOver(true)
      }
    }
  }, [gameStart, valid1DSnapshot])

  useEffect(() => {
    handleStartGame(difficulty)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStart) {
        setTimer((prev) => (prev += 1))
      }
    }, 1000)
    if (gameOver) {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [gameStart, gameOver])

  return (
    <GameContext.Provider
      value={{
        volume,
        difficulty,
        flagsCount,
        timer,
        gameStart,
        gameOver,
        board,
        highScore,
        toggleVolume: handleToggleVolume,
        changeDifficulty: handleChangeDifficulty,
        restart: handleRestart,
        onCellReveal,
        onCellChangeMeta: handleChangeCellMeta,
        setBoard,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  return useContext(GameContext)
}
