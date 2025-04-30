"use client"

import { motion } from "framer-motion"

interface PromptCardProps {
  question: string
  description?: string
  isKeyQuestion?: boolean
  isActive?: boolean
}

export default function PromptCard({ question, description, isKeyQuestion = false, isActive = true }: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 rounded-xl
        ${isActive ? "bg-gradient-to-r from-blue-50 to-blue-100 shadow-md" : "bg-gray-50"}
        ${isKeyQuestion && isActive ? "border-l-4 border-blue-500" : ""}
      `}
    >
      {isKeyQuestion && isActive && (
        <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-2">KEY QUESTION</div>
      )}
      <h3
        className={`
          ${isKeyQuestion ? "text-gray-900 font-medium" : "text-gray-800"} 
          ${isActive ? "text-base sm:text-xl" : "text-sm sm:text-base"}
          leading-relaxed
        `}
      >
        {question}
      </h3>
      {description && <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>}
    </motion.div>
  )
}
