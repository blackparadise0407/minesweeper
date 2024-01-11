import { AnimatePresence } from 'framer-motion'
import { Fragment } from 'react'

import { Board, ControlPanel, NewGamePanel } from './components'
import { useGameContext } from './contexts/GameContext'

export default function App() {
  const { gameOver } = useGameContext()

  return (
    <Fragment>
      <div className="h-screen grid place-content-center">
        <ControlPanel />
        <Board />
      </div>
      <AnimatePresence initial={false}>
        {gameOver && <NewGamePanel />}
      </AnimatePresence>
    </Fragment>
  )
}
