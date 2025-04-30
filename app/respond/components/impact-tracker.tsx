"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface ImpactTrackerProps {
  currentStep: number
  totalSteps: number
  showFollowUp: boolean
  showAcknowledgment?: boolean
  lastResponseAdded?: boolean
  resetLastResponseAdded?: () => void
  onPrevious?: () => void
  showFinalCelebration?: boolean
  insightsCount?: number
}

export default function ImpactTracker({
  currentStep,
  totalSteps,
  showFollowUp,
  showAcknowledgment = false,
  lastResponseAdded = false,
  resetLastResponseAdded,
  onPrevious,
  showFinalCelebration = false,
  insightsCount = 0,
}: ImpactTrackerProps) {
  const [showInsightMessage, setShowInsightMessage] = useState(false)

  // Calculate progress percentage
  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / totalSteps) * 100

  // Adjust progress for follow-up questions
  const adjustedProgress = showFollowUp ? progress - (1 / totalSteps) * 0.5 : progress

  // Handle new response added
  useEffect(() => {
    if (lastResponseAdded) {
      // Show insight message
      setShowInsightMessage(true)

      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        setShowInsightMessage(false)
        if (resetLastResponseAdded) resetLastResponseAdded()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [lastResponseAdded, resetLastResponseAdded])

  // Trigger confetti when final celebration should be shown
  useEffect(() => {
    if (showFinalCelebration) {
      // Launch confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#333333", "#555555", "#777777", "#999999", "#BBBBBB"],
      })
    }
  }, [showFinalCelebration])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs sm:text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 sm:h-4 sm:w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
        )}
        <span className="text-xs text-gray-500 ml-auto font-medium">
          {Math.round(adjustedProgress) === 100 ? "Last Key Question!" : `${Math.round(adjustedProgress)}% complete`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gray-800"
          initial={{ width: 0 }}
          animate={{ width: `${adjustedProgress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Insight unlocked message */}
      <div className="h-6 mt-1.5">
        <AnimatePresence>
          {showInsightMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs text-gray-700 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              +1 Insight unlocked! ({insightsCount} total)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Impact message at final celebration */}
      {showFinalCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-sm text-center p-2.5 bg-gray-50 text-gray-700 rounded-xl"
        >
          Your insights are shaping our understanding! Thank you for your valuable contribution.
        </motion.div>
      )}
    </div>
  )
}
