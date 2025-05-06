"use client"

import { motion } from "framer-motion"

interface QuestionBubbleProps {
  question: string
  description?: string
  isFollowUp?: boolean
  isKeyQuestion?: boolean
  isActive?: boolean
}

export default function QuestionBubble({
  question,
  description,
  isFollowUp = false,
  isKeyQuestion = false,
  isActive = true,
}: QuestionBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex max-w-[90%] sm:max-w-[85%]"
    >
      <div
        className={`
          conversation-bubble conversation-bubble-system
          rounded-2xl px-5 py-4 shadow-sm w-full
          ${isKeyQuestion ? "border-l-[3px] border-gray-400" : ""}
        `}
      >
        {isKeyQuestion && <div className="text-sm text-gray-600 font-medium tracking-tight mb-2">KEY QUESTION</div>}
        <p
          className={`
            ${isKeyQuestion ? "text-gray-900 font-medium" : "text-gray-800"} 
            ${isKeyQuestion ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}
            leading-relaxed tracking-tight break-words
          `}
        >
          {question}
        </p>
        {description && (
          <p className="text-base sm:text-lg text-gray-500 mt-2 leading-relaxed tracking-tight break-words">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}
