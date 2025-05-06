"use client"

import { motion } from "framer-motion"

interface SpotlightAnswerProps {
  answer: string
  isActive?: boolean
}

export default function SpotlightAnswer({ answer, isActive = true }: SpotlightAnswerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0.9, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div
        className={`
          conversation-bubble conversation-bubble-user
          rounded-2xl px-4 py-3 max-w-[90%] sm:max-w-[85%]
          ${isActive ? "shadow-sm" : "opacity-90"}
        `}
      >
        <p
          className={`
            ${isActive ? "text-lg sm:text-xl" : "text-base sm:text-lg"}
            leading-relaxed tracking-tight text-gray-800 break-words
          `}
        >
          {answer}
        </p>
      </div>
    </motion.div>
  )
}
