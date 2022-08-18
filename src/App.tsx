import { HiClock, HiFlag } from 'react-icons/hi'

import { Board } from './components'
import { useGameContext } from './contexts/GameContext'

export default function App() {
  const { gameOver, board, timer, minesCount } = useGameContext()
  return (
    <div className="h-screen grid place-content-center">
      <div>
        {gameOver && <h1>Game over</h1>}
        <div className="flex px-2 py-4 mb-2 justify-evenly text-xl bg-green-500">
          <div className="flex items-center gap-2">
            <HiFlag className="text-red-500" />
            <p className="text-white">{minesCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="text-blue-500" />
            <p className="text-white">{timer}</p>
          </div>
        </div>

        <Board />
      </div>
    </div>
  )
}
