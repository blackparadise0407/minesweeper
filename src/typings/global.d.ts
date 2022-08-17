declare global {
  type CellMeta = 'mine' | 'unsure' | undefined

  interface Cell<T = number> {
    value: T
    revealed: boolean
    meta?: CellMeta
  }
}
export {}
