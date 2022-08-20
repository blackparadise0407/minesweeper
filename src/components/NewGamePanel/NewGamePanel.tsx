import { motion, Variants } from 'framer-motion'
import { memo, useEffect } from 'react'
import { AiOutlineReload } from 'react-icons/ai'
import { BsTrophyFill } from 'react-icons/bs'
import { FaClock } from 'react-icons/fa'

import bgSfx from '@/assets/sounds/bg.mp3?url'
import { useGameContext } from '@/contexts/GameContext'

const variants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
  },
}

export default memo(function NewGamePanel() {
  const { timer, highScore, volume, restart } = useGameContext()

  useEffect(() => {
    const bgm = new Audio(bgSfx)
    const playPromise = bgm.play()
    bgm.volume = volume

    return () => {
      if (playPromise !== undefined) {
        playPromise.then((_) => {
          bgm.pause()
        })
      }
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen grid place-content-center bg-black bg-opacity-30 z-[999]">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded min-w-[300px] max-w-[300px] space-y-4">
          <div className="bg-white rounded p-3 flex justify-evenly">
            <div className="flex flex-col items-center gap-3">
              <FaClock className="text-blue-400 text-3xl" />
              <span className="text-lg font-bold">
                {String(timer).padStart(3, '0')}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <BsTrophyFill className="text-yellow-400 text-3xl" />
              <span className="text-lg font-bold">
                {String(highScore).padStart(3, '0')}
              </span>
            </div>
          </div>
          <button
            className="w-full p-2 rounded flex items-center gap-2 justify-center bg-green-500 text-white"
            onClick={restart}
          >
            <AiOutlineReload className="text-xl" />
            <span className="font-medium text-lg">Play again</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
})
