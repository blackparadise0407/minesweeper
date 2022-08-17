const neighbours = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, -1],
  [-1, 0],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

export const generateBoard = (
  width: number,
  height: number,
  mines: number,
): Array<Array<Cell>> => {
  const result: Array<Array<Cell>> = []

  let _mines = 0

  const ratio = (width * height) / mines

  const minesCord = []

  for (let row = 0; row < width; row++) {
    result[row] = []
    for (let col = 0; col < height; col++) {
      const val = Math.random() * 100
      if (val < ratio && _mines <= mines) {
        result[row][col] = {
          revealed: false,
          value: -1,
        }
        _mines += 1
        minesCord.push([row, col])
      } else
        result[row][col] = {
          revealed: false,
          value: 0,
        }
    }
  }

  minesCord.forEach(([mX, mY]) => {
    neighbours.forEach(([nX, nY]) => {
      if (
        typeof result?.[mX + nX]?.[mY + nY] !== 'undefined' &&
        result[mX + nX][mY + nY].value !== -1
      ) {
        result[mX + nX][mY + nY].value += 1
      }
    })
  })

  return result
}
