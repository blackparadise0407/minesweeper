import { Board } from './components'
import { useGameContext } from './contexts/GameContext'

export default function App() {
  const { board } = useGameContext()
  return (
    <div className="h-screen grid place-content-center">
      <Board board={board} />
    </div>
  )
}
