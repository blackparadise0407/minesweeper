import { produce } from 'immer'
import { memo, useCallback } from 'react'

import { useGameContext } from '@/contexts/GameContext'
import { neighbours } from '@/helpers'

import { Cell } from '../Cell'
import { CellClickFn } from '../Cell/Cell'

interface BoardProps {
  board: Array<Array<Cell>>
}

export default memo(function Board({ board }: BoardProps) {
  const { board: boardCtx, setBoard } = useGameContext()

  const handleRevealCell: CellClickFn<number> = useCallback(([x, y, value]) => {
    if (value === -1) {
      setBoard(
        produce((draft) => {
          draft[x][y].revealed = true
        }),
      )
      alert('Loser!')
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
