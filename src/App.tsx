import { AnimatePresence } from 'framer-motion'
import { HiClock, HiFlag } from 'react-icons/hi'

import { Board, NewGamePanel } from './components'
import { useGameContext } from './contexts/GameContext'

export default function App() {
  const { gameOver, timer, flagsCount } = useGameContext()
  return (
    <div className="h-screen grid place-content-center">
      <div className="relative">
        <div className="flex px-2 py-4 mb-2 justify-evenly text-xl bg-green-500">
          <div className="flex items-center gap-2">
            <HiFlag className="text-red-500" />
            <p className="text-white">{flagsCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="text-blue-500" />
            <p className="text-white">{timer}</p>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {gameOver && <NewGamePanel />}
        </AnimatePresence>
        <Board />
      </div>
    </div>
  )
}
