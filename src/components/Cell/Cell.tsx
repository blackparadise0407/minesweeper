import clsx from 'clsx'
import React, { memo } from 'react'
import { FaBomb } from 'react-icons/fa'
import { HiFlag } from 'react-icons/hi'

import { useGameContext } from '@/contexts/GameContext'

export interface CellClickFn<TData> {
  (data: [...Cords, TData]): void
}

interface CellProps {
  cell: Cell
  cords: Cords
  onReveal?: CellClickFn<number>
  onChangeMeta?: CellClickFn<CellMeta>
}

const renderCell = (value: number): React.ReactNode => {
  if (value === -1) {
    return <FaBomb className="text-red-500" />
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
    default:
      return null
  }
}

const shouldBeLighter = (cords: Cords) => {
  const [x, y] = cords
  if (x % 2 === 0 && y % 2 !== 0) {
    return true
  }
  if (x % 2 !== 0 && y % 2 === 0) {
    return true
  }
  return false
}

const getCellBg = (cell: Cell, cords: Cords) => {
  const isLighter = shouldBeLighter(cords)
  if (!cell.revealed) {
    return isLighter
      ? 'bg-green-400 hover:bg-green-300'
      : 'bg-green-500 hover:bg-green-300'
  } else {
    return isLighter ? 'bg-amber-100' : 'bg-amber-200'
  }
}

const rotations: CellMeta[] = [undefined, 'mine']

export default memo(function Cell({
  cell,
  cords,
  onChangeMeta = () => {},
}: CellProps) {
  const { onCellReveal } = useGameContext()

  const onRightClick = () => {
    if (!cell.revealed) {
      const foundIdx = rotations.indexOf(cell.meta)
      if (foundIdx > -1) {
        const nextMetaIdx = (foundIdx + 1) % rotations.length
        onChangeMeta([...cords, rotations[nextMetaIdx]])
      }
    }
  }

  const onLeftClick = () => {
    if (!cell.revealed && !cell.meta) {
      onCellReveal([...cords, cell.value])
    }
  }

  return (
    <div
      className={clsx(
        'grid place-content-center outline-gray-500 cursor-default transition-colors',
        getCellBg(cell, cords),
      )}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      onClick={onLeftClick}
    >
      {cell.revealed && (
        <span className={clsx('font-bold', getCellColorClsx(cell.value))}>
          {renderCell(cell.value)}
        </span>
      )}
      {!cell.revealed && (
        <span className="text-xl">{renderCellMeta(cell.meta)}</span>
      )}
    </div>
  )
})
