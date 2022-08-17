import { produce } from 'immer'
import { memo, useCallback } from 'react'

import { useGameContext } from '@/contexts/GameContext'
import { exploreBoard, neighbours } from '@/helpers'

import { Cell } from '../Cell'
import { CellClickFn } from '../Cell/Cell'

interface BoardProps {
  board: Array<Array<Cell>>
}

export default memo(function Board({ board }: BoardProps) {
  const { board: boardCtx, setBoard } = useGameContext()

  const handleRevealCell: CellClickFn<number> = useCallback(([x, y, value]) => {
    // if (value === -1) {
    //   alert('You lose')
    // }
    // exploreBoard([x, y], boardCtx)
    setBoard(
      produce((draft) => {
        // draft[x][y].revealed = true

        if (draft[x][y].value === -1) {
          return
        }
        if (draft[x][y].value > 0) {
          draft[x][y].revealed = true
          return
        }

        const visited: Array<Cords> = []
        visited.push([x, y])
        draft[x][y].revealed = true

        while (visited.length) {
          const [vX, vY] = visited.pop()!
          for (const [nX, nY] of neighbours) {
            if (
              typeof draft?.[nX + vX]?.[nY + vY] !== 'undefined' &&
              draft[nX + vX][nY + vY].value !== -1
            ) {
              if (
                draft[nX + vX][nY + vY].value === 0 &&
                visited.findIndex(
                  ([fX, fY]) => fX === nX + vX && fY === nY + vY,
                ) === -1
              ) {
                visited.push([nX + vX, nY + vY])
              }
              draft[nX + vX][nY + vY].revealed = true
            }
          }
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
