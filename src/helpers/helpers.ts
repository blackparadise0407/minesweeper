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

export const adjacentNeighbours = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
]

export const generateBoard = (
  height: number,
  width: number,
  mines: number,
): { board: Array<Array<Cell>>; minesCords: Array<Array<number>> } => {
  const result: Array<Array<Cell>> = []

  let _mines = 0

  const minesCords: Array<Array<number>> = []

  for (let row = 0; row < width; row++) {
    result[row] = []
    for (let col = 0; col < height; col++) {
      result[row][col] = {
        revealed: false,
        value: 0,
      }
    }
  }

  while (_mines < mines) {
    const mX = Math.floor(Math.random() * width)
    const mY = Math.floor(Math.random() * height)
    if (result[mX][mY].value !== -1) {
      _mines++
      result[mX][mY].value = -1
      minesCords.push([mX, mY])
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

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}
