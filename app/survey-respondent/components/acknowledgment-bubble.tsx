"use client"

import { motion } from "framer-motion"

interface AcknowledgmentBubbleProps {
  message: string
  isFinal?: boolean
}

export default function AcknowledgmentBubble({ message, isFinal = false }: AcknowledgmentBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex"
    >
      <div
        className={`
          rounded-2xl rounded-tl-none px-3 py-2 sm:px-4 sm:py-3 shadow-sm bg-gray-200 max-w-[90%] sm:max-w-[85%]
          ${isFinal ? "border-b border-gray-300" : ""}
        `}
      >
        <p className="text-sm sm:text-base text-gray-800">{message}</p>
      </div>
    </motion.div>
  )
}
