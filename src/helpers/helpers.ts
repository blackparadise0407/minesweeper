import { produce } from 'immer'

export const neighbours = [
  [0, 1],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [1, 0],
  [1, 1],
]

export const generateBoard = (
  width: number,
  height: number,
  mines: number,
): { board: Array<Array<Cell>>; minesCords: Array<Array<number>> } => {
  const result: Array<Array<Cell>> = []

  let _mines = 0

  const ratio = (mines * 100) / (width * height)

  const minesCords: Array<Array<number>> = []

  for (let row = 0; row < width; row++) {
    result[row] = []
    for (let col = 0; col < height; col++) {
      const val = Math.random() * 100
      if (val < ratio && _mines < mines) {
        result[row][col] = {
          revealed: false,
          value: -1,
        }
        _mines += 1
        minesCords.push([row, col])
      } else
        result[row][col] = {
          revealed: false,
          value: 0,
        }
    }
  }

  minesCords.forEach(([mX, mY]) => {
    neighbours.forEach(([nX, nY]) => {
      if (
        typeof result?.[mX + nX]?.[mY + nY] !== 'undefined' &&
        result[mX + nX][mY + nY].value !== -1
      ) {
        result[mX + nX][mY + nY].value += 1
      }
    })
  })

  return {
    board: result,
    minesCords,
  }
}

export const exploreBoard = (cords: Cords, board: Array<Array<Cell>>) => {
  const [x, y] = cords
  if (board[x][y].value === -1) {
    return
  }
  if (board[x][y].value > 0) {
    return produce(board, (draft) => {
      draft[x][y].revealed = true
    })
  }

  return produce(board, (draft) => {
    const stack = []
    neighbours.forEach(([nX, nY]) => {
      if (typeof draft?.[nX + x][nY + y] !== undefined) {
        draft[nX + x][nY + y].revealed = true
      }
    })
  })
}
