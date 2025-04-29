"use client"

import { motion } from "framer-motion"

interface AffirmationBubbleProps {
  message: string
}

export default function AffirmationBubble({ message }: AffirmationBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end mb-1"
    >
      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">{message}</div>
    </motion.div>
  )
}
