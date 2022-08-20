import clsx from 'clsx'
import { memo } from 'react'

import { useGameContext } from '@/contexts/GameContext'

import { Cell } from '../Cell'

const getCellSizeFromDiff = (diff: Difficulty) => {
  switch (diff) {
    case 'easy':
      return 40
    case 'medium':
      return 35
    case 'hard':
      return 30
    default:
      return 30
  }
}

export default memo(function Board() {
  const { gameOver, board, difficulty, onCellChangeMeta } = useGameContext()

  if (!board.length) return null

  return (
    <div
      className={clsx('grid select-none', gameOver && 'pointer-events-none')}
      style={{
        gridTemplateRows: `repeat(${board.length}, ${getCellSizeFromDiff(
          difficulty,
        )}px)`,
        gridTemplateColumns: `repeat(${board[0].length}, ${getCellSizeFromDiff(
          difficulty,
        )}px)`,
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}_${cIdx}`}
            cords={[rIdx, cIdx]}
            cell={cell}
            onChangeMeta={onCellChangeMeta}
          />
        )),
      )}
    </div>
  )
})
