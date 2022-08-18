import clsx from 'clsx'
import { produce } from 'immer'
import { memo, useCallback } from 'react'

import { useGameContext } from '@/contexts/GameContext'

import { Cell } from '../Cell'
import { CellClickFn } from '../Cell/Cell'

export default memo(function Board() {
  const { gameOver, board, setBoard } = useGameContext()

  const handleChangeCellMeta: CellClickFn<CellMeta> = useCallback(
    ([x, y, meta]) => {
      setBoard(
        produce((draft) => {
          draft[x][y].meta = meta
        }),
      )
    },
    [],
  )

  if (!board.length) return null

  return (
    <div
      className={clsx('grid select-none', gameOver && 'pointer-events-none')}
      style={{
        gridTemplateRows: `repeat(${board.length}, 40px)`,
        gridTemplateColumns: `repeat(${board[0].length}, 40px)`,
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}_${cIdx}`}
            cords={[rIdx, cIdx]}
            cell={cell}
            onChangeMeta={handleChangeCellMeta}
          />
        )),
      )}
    </div>
  )
})
