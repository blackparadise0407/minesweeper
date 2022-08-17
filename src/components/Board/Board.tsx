import { produce } from 'immer'
import { memo, useCallback } from 'react'

import { useGameContext } from '@/contexts/GameContext'

import { Cell } from '../Cell'
import { CellClickFn } from '../Cell/Cell'

interface BoardProps {
  board: Array<Array<Cell>>
}

export default memo(function Board({ board }: BoardProps) {
  const { setBoard } = useGameContext()

  const handleRevealCell: CellClickFn<number> = useCallback(([x, y, value]) => {
    if (value === -1) {
      alert('You lose')
    }
    setBoard(
      produce((draft) => {
        draft[x][y].revealed = true
      }),
    )
  }, [])

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

  return (
    <div
      className="grid gap-[1px]"
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
            onReveal={handleRevealCell}
            onChangeMeta={handleChangeCellMeta}
          />
        )),
      )}
    </div>
  )
})
