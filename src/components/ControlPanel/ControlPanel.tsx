import { memo } from 'react'
import { HiClock, HiFlag } from 'react-icons/hi'
import { IoVolumeMuteSharp, IoVolumeHighSharp } from 'react-icons/io5'

import { useGameContext } from '@/contexts/GameContext'

const gameDifficulty: Difficulty[] = ['easy', 'medium', 'hard']

export default memo(function ControlPanel() {
  const {
    difficulty,
    volume,
    timer,
    flagsCount,
    toggleVolume,
    changeDifficulty,
  } = useGameContext()

  return (
    <div className="flex px-2 py-4 justify-evenly text-xl bg-green-600">
      <div className="flex-1">
        <select
          className="border-none outline-none text-sm rounded font-medium"
          value={difficulty}
          onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
        >
          {gameDifficulty.map((diff) => (
            <option key={diff} className="font-medium" value={diff}>
              {diff.charAt(0).toUpperCase() + diff.substring(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-evenly flex-1">
        <div className="flex items-center gap-2">
          <HiFlag className="text-red-500 text-3xl" />
          <p className="text-white">{flagsCount}</p>
        </div>
        <div className="flex items-center gap-2">
          <HiClock className="text-blue-500 text-3xl" />
          <p className="text-white">{timer}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-end">
        <span className="text-white text-3xl" onClick={toggleVolume}>
          {volume ? <IoVolumeHighSharp /> : <IoVolumeMuteSharp />}
        </span>
      </div>
    </div>
  )
})
