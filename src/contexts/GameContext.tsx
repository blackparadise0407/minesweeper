import { createContext, useContext, useEffect, useState } from 'react'

import { generateBoard } from '@/helpers'

interface GameContext {
  board: Array<Array<Cell>>
  setBoard: React.Dispatch<React.SetStateAction<GameContext['board']>>
}

interface GameProviderProps {
  children: React.ReactNode
}

const GameContext = createContext<GameContext>({
  board: [],
  setBoard: () => {},
})

export const GameProvider = ({ children }: GameProviderProps) => {
  const [board, setBoard] = useState<GameContext['board']>(() =>
    generateBoard(15, 15, 20),
  )

  useEffect(() => {
    console.log('ON game init')
  }, [])

  return (
    <GameContext.Provider value={{ board, setBoard }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  return useContext(GameContext)
}
