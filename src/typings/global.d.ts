declare global {
  type CellMeta = 'mine' | undefined

  interface Cell<T = number> {
    value: T
    revealed: boolean
    meta?: CellMeta
  }

  type Cords = [number, number]

  type Difficulty = 'easy' | 'medium' | 'hard'
}
export {}
