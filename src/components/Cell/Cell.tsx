import clsx from 'clsx'
import React, { memo } from 'react'
import { BiBomb } from 'react-icons/bi'
import { BsQuestion } from 'react-icons/bs'
import { HiFlag } from 'react-icons/hi'

export interface CellClickFn<TData> {
  (cords: [number, number, TData]): void
}

interface CellProps {
  cell: Cell
  cords: [number, number]
  onReveal?: CellClickFn<number>
  onChangeMeta?: CellClickFn<CellMeta>
}

const renderCell = (value: number): React.ReactNode => {
  if (value === -1) {
    return <BiBomb />
  } else if (value === 0) {
    return ''
  } else {
    return value.toString()
  }
}

const getCellColorClsx = (value: number) => {
  if (value === -1) {
    return 'text-black'
  } else if (value === 1) {
    return 'text-blue-500'
  } else if (value === 2) {
    return 'text-green-500'
  } else if (value === 3) {
    return 'text-red-500'
  } else if (value === 4) {
    return 'text-purple-900'
  } else if (value === 5) {
    return 'text-orange-900'
  } else {
    return 'text-black'
  }
}

const renderCellMeta = (meta: CellMeta) => {
  switch (meta) {
    case 'mine':
      return <HiFlag className="text-red-500" />
    case 'unsure':
      return <BsQuestion className="text-green-500" />
    default:
      return null
  }
}

const shouldBeLighter = (cords: [number, number]) => {
  const [x, y] = cords
  if (x % 2 === 0 && y % 2 !== 0) {
    return true
  }
  if (x % 2 !== 0 && y % 2 === 0) {
    return true
  }
  return false
}

const rotations: CellMeta[] = [undefined, 'mine', 'unsure']

export default memo(function Cell({
  cell,
  cords,
  onReveal = () => {},
  onChangeMeta = () => {},
}: CellProps) {
  const [x, y] = cords
  const onRightClick = (currentMeta: CellMeta) => {
    const foundIdx = rotations.indexOf(currentMeta)
    if (foundIdx > -1) {
      const nextMetaIdx = (foundIdx + 1) % rotations.length
      onChangeMeta([...cords, rotations[nextMetaIdx]])
    }
  }

  return (
    <div
      className={clsx(
        'grid place-content-center outline outline-1 outline-gray-500 cursor-pointer transition-colors',
        !cell.revealed && 'bg-gray-200 hover:bg-gray-300',
      )}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick(cell.meta)
      }}
      onClick={() => {
        if (!cell.revealed) {
          onReveal([...cords, cell.value])
        }
      }}
    >
      {!cell.revealed && (
        <span className={clsx('font-bold', getCellColorClsx(cell.value))}>
          {renderCell(cell.value)}
        </span>
      )}
      {/* {!cell.revealed && (
        <span className="text-xl">{renderCellMeta(cell.meta)}</span>
      )} */}
    </div>
  )
})
