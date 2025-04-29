"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Heart } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ThankYouMuralProps {
  respondentName?: string
  onExit?: () => void
}

export default function ThankYouMural({ respondentName, onExit }: ThankYouMuralProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Define emojis with their sentiment categories
  const emojis = [
    { emoji: "😞", label: "Poor", value: 1, sentiment: "negative" },
    { emoji: "😐", label: "Okay", value: 2, sentiment: "negative" },
    { emoji: "🙂", label: "Good", value: 3, sentiment: "neutral" },
    { emoji: "😊", label: "Great", value: 4, sentiment: "positive" },
    { emoji: "🤩", label: "Excellent", value: 5, sentiment: "positive" },
  ]

  // Get background color based on sentiment
  const getSentimentColor = (sentiment: string, isSelected = false) => {
    if (isSelected) {
      switch (sentiment) {
        case "negative":
          return "bg-red-100 border-red-200 text-red-600"
        case "neutral":
          return "bg-yellow-100 border-yellow-200 text-yellow-600"
        case "positive":
          return "bg-green-100 border-green-200 text-green-600"
        default:
          return "bg-gray-100 border-gray-200 text-gray-600"
      }
    } else {
      // Hover state colors (more visible)
      switch (sentiment) {
        case "negative":
          return "hover:bg-red-100 hover:text-red-600"
        case "neutral":
          return "hover:bg-yellow-100 hover:text-yellow-600"
        case "positive":
          return "hover:bg-green-100 hover:text-green-600"
        default:
          return "hover:bg-gray-100 hover:text-gray-600"
      }
    }
  }

  // Get the selected emoji's sentiment
  const getSelectedSentiment = () => {
    if (selectedRating === null) return null
    const selected = emojis.find((item) => item.value === selectedRating)
    return selected ? selected.sentiment : null
  }

  const handleExit = () => {
    if (onExit) {
      onExit()
    } else {
      // Default behavior if no onExit handler is provided
      window.location.href = "/"
    }
  }

  const submitFeedback = () => {
    // Create feedback object with the rating and text feedback
    const feedbackData = {
      rating: selectedRating,
      feedback: feedback,
    }

    console.log("Submitting feedback:", feedbackData)

    // In a real app, you would send this to your API
    // For example:
    // fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedbackData)
    // })

    // Show the final page instead of exiting immediately
    setIsSubmitted(true)
  }

  // Final "take care" page
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] bg-dotted-pattern p-4 animated-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg p-6 sm:p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block bg-[#1a1e27] text-white rounded-full p-4 sm:p-5 mb-4 sm:mb-5 mx-auto"
          >
            <Heart className="h-10 w-10 sm:h-12 sm:w-12" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a1e27] mb-3 sm:mb-4 tracking-tight">Take care!</h2>

          <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-3">
            Your feedback has been submitted successfully.
          </p>

          <p className="text-sm sm:text-base text-gray-500">
            You can now close this window or navigate away from the page.
          </p>

          <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-center text-gray-400">Powered by Insightflo</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] bg-dotted-pattern p-4 animated-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg p-6 sm:p-8"
      >
        <div className="text-center mb-5 sm:mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block bg-[#1a1e27] text-white rounded-full p-4 sm:p-5 mb-4 sm:mb-5 mx-auto"
          >
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12" />
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1e27] mb-2 sm:mb-3 tracking-tight">
            Thank you{respondentName ? `, ${respondentName}` : ""}!
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            Your insights are incredibly valuable and will help shape our understanding.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 max-w-lg mx-auto">
          {/* Emoji Rating Scale */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-center mb-3 sm:mb-4 tracking-tight">
              How was your conversation experience?
            </h3>

            <div className="flex justify-between items-center mb-3 sm:mb-4">
              {emojis.map((item) => {
                const isSelected = selectedRating === item.value
                const sentimentColorClass = getSentimentColor(item.sentiment, isSelected)

                return (
                  <motion.button
                    key={item.value}
                    onClick={() => setSelectedRating(item.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all duration-200
                      ${isSelected ? `${sentimentColorClass} border shadow-sm` : `${sentimentColorClass} border border-transparent`}
                      focus:outline-none
                    `}
                    aria-label={`Rate as ${item.label}`}
                    aria-pressed={isSelected}
                    role="radio"
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                    <span
                      className={`text-xs sm:text-sm transition-colors duration-200 ${
                        isSelected ? "font-medium" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Visual indicator for screen readers */}
                    {isSelected && <span className="sr-only">(Selected)</span>}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Feedback Text Area */}
          <div>
            <Label htmlFor="feedback" className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
              Tell us more about your experience (optional)
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share any thoughts about your experience..."
              className="w-full resize-none min-h-[80px] sm:min-h-[100px] rounded-lg text-sm sm:text-base"
            />
          </div>

          {/* Submit Button - greyed out until an emoji is selected */}
          <Button
            onClick={submitFeedback}
            className={`w-full rounded-full h-11 sm:h-14 text-base sm:text-lg font-medium transition-colors duration-300 ${
              selectedRating
                ? "bg-[#1a1e27] hover:bg-[#2a2e37] text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedRating}
          >
            Submit & Exit
          </Button>

          {/* Footer */}
          <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-center text-gray-400">Powered by Insightflo</div>
        </div>
      </motion.div>
    </div>
  )
}
