"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface EmojiPollProps {
  onComplete: (rating: number, comment: string) => void
}

export default function EmojiPoll({ onComplete }: EmojiPollProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emojis = [
    { emoji: "😞", label: "Frustrated", value: 1 },
    { emoji: "😐", label: "Neutral", value: 2 },
    { emoji: "🙂", label: "Good", value: 3 },
    { emoji: "😊", label: "Great", value: 4 },
    { emoji: "🤩", label: "Excellent", value: 5 },
  ]

  const handleSubmit = () => {
    if (selectedRating !== null) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        onComplete(selectedRating, comment)
        setIsSubmitting(false)
      }, 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm"
    >
      <h3 className="text-lg sm:text-xl font-medium text-center mb-4">How's your experience so far?</h3>

      <div className="flex justify-center space-x-4 sm:space-x-6 mb-6">
        {emojis.map((item) => (
          <button
            key={item.value}
            onClick={() => setSelectedRating(item.value)}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-all
              ${selectedRating === item.value ? "bg-gray-200 scale-110 shadow-sm" : "hover:bg-gray-100"}
            `}
            aria-label={`Rate as ${item.label}`}
          >
            <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
            <span className="text-xs text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>

      {selectedRating !== null && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Any additional thoughts? (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-base apple-input"
            rows={2}
            placeholder="Share your thoughts..."
          />
        </motion.div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={selectedRating === null || isSubmitting}
          className={`
            px-4 py-2 rounded-full font-medium text-white apple-button
            ${
              selectedRating !== null
                ? "bg-gray-800 hover:bg-gray-700 apple-button-primary"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>
    </motion.div>
  )
}
