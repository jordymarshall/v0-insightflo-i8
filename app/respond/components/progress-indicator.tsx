"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  showFollowUp: boolean
  showAcknowledgment?: boolean
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  showFollowUp,
  showAcknowledgment = false,
}: ProgressIndicatorProps) {
  // Calculate progress percentage
  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / totalSteps) * 100

  // Adjust progress for follow-up questions
  const adjustedProgress = showFollowUp ? progress - (1 / totalSteps) * 0.5 : progress

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${adjustedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Progress text */}
      <div className="flex justify-end mt-1 sm:mt-2 text-xs text-gray-500">
        <span>
          {Math.round(adjustedProgress) === 100 ? "Last Question" : `${Math.round(adjustedProgress)}% complete`}
        </span>
      </div>
    </div>
  )
}
