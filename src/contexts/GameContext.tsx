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

export const HIGHSCORE_KEY = 'minesweeper_highscore'
interface GameContext {
  timer: number
  gameStart: boolean
  gameOver: boolean
  flagsCount: number
  board: Array<Array<Cell>>
  onRestart: () => void
  onCellChangeMeta: CellClickFn<CellMeta>
  onCellReveal: CellClickFn<number>
  setBoard: React.Dispatch<React.SetStateAction<GameContext['board']>>
}

interface GameProviderProps {
  children: React.ReactNode
}

const GameContext = createContext<GameContext>({
  board: [],
  timer: 0,
  gameOver: false,
  gameStart: false,
  flagsCount: 0,
  onCellReveal: () => {},
  onCellChangeMeta: () => {},
  setBoard: () => {},
  onRestart: () => {},
})

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameOver, setGameOver] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [board, setBoard] = useState<GameContext['board']>([])
  const [minesCords, setMinesCords] = useState<Array<Array<number>>>([])
  const [timer, setTimer] = useState(0)

  const [click] = useSound(clickSfx)
  const [click1] = useSound(click1Sfx)
  const [click2] = useSound(click2Sfx)
  const [click3] = useSound(click3Sfx)
  const [click4] = useSound(click4Sfx)
  const [click5] = useSound(click5Sfx)
  const [flagFlap] = useSound(flagFlapSfx)
  const [lose] = useSound(loseSfx)
  const [positiveClick] = useSound(positiveClickSfx)

  const valid1DSnapshot = useMemo(
    () => board.flat(1).filter((c) => c.value !== -1),
    [board],
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
        setTimeout(() => setGameOver(true), 1000)
        return
      }

      switch (value) {
        case 0:
          positiveClick()
          break
        case 1:
          click()
          break
        case 2:
          click1()
          break
        case 3:
          click2()
          break
        case 4:
          click3()
          break
        case 5:
          click4()
          break
        case 6:
          click5()
          break
        default:
          break
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
            const [qX, qY] = queue[0]
            queue.shift()
            neighbours.forEach(([nX, nY]) => {
              if (typeof draft?.[nX + qX]?.[nY + qY] !== 'undefined') {
                if (
                  draft[nX + qX][nY + qY].value === 0 &&
                  !draft[nX + qX][nY + qY].revealed === true
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

  const handleRestart = useCallback(() => {
    setGameOver(false)
    setGameStart(true)
    const { board, minesCords } = generateBoard(8, 10, 10)
    setBoard(board)
    setMinesCords(minesCords)
    setTimer(0)
  }, [])

  useEffect(() => {
    if (gameStart) {
      if (valid1DSnapshot.every((c) => c.revealed)) {
        const lastHighScore = window.sessionStorage.getItem(HIGHSCORE_KEY) ?? 0
        if (!lastHighScore || (lastHighScore && timer < +lastHighScore)) {
          window.sessionStorage.setItem(HIGHSCORE_KEY, timer.toString())
        }
        setGameOver(true)
      }
    }
  }, [gameStart, valid1DSnapshot])

  useEffect(() => {
    const { board, minesCords } = generateBoard(8, 10, 10)
    setBoard(board)
    setMinesCords(minesCords)
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
        flagsCount,
        timer,
        gameStart,
        gameOver,
        board,
        onRestart: handleRestart,
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
