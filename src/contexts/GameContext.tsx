import { produce } from 'immer'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CellClickFn } from '@/components/Cell/Cell'
import { generateBoard, neighbours } from '@/helpers'

interface GameContext {
  timer: number
  gameStart: boolean
  gameOver: boolean
  flagsCount: number
  board: Array<Array<Cell>>
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
  setBoard: () => {},
})

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameOver, setGameOver] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [board, setBoard] = useState<GameContext['board']>([])
  const [minesCords, setMinesCords] = useState<Array<Array<number>>>([])
  const [timer, setTimer] = useState(0)

  const valid1DSnapshot = useMemo(
    () => board.flat(1).filter((c) => c.value !== -1),
    [board],
  )

  const flagsCount = useMemo(
    () =>
      minesCords.length - board.flat(1).filter((c) => c.meta === 'mine').length,
    [minesCords, board],
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
        setGameOver(true)
        return
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
    [minesCords],
  )

  useEffect(() => {
    if (gameStart) {
      if (valid1DSnapshot.every((c) => c.revealed)) {
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
        onCellReveal,
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
