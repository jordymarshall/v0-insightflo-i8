"use client"

import { motion } from "framer-motion"
import { AlertCircle, ThumbsUp, Star, Award, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface MicroCelebrationProps {
  currentKeyQuestionNumber: number
  totalKeyQuestions: number
  responseText?: string // Optional prop for the current response text
  isTyping?: boolean // Optional prop to indicate if user is currently typing
  showProgressMeter?: boolean // Optional prop to toggle progress meter visibility
  isLastQuestion?: boolean // Optional prop to indicate if this is the last question
}

export default function MicroCelebration({
  currentKeyQuestionNumber,
  totalKeyQuestions,
  responseText = "",
  isTyping = false,
  showProgressMeter = false,
  isLastQuestion = false,
}: MicroCelebrationProps) {
  // State for tracking response quality
  const [responseQuality, setResponseQuality] = useState<"poor" | "good" | "excellent">("poor")
  const [feedbackMessage, setFeedbackMessage] = useState<string>("")

  // Evaluate response quality based on text length
  useEffect(() => {
    if (!responseText || !showProgressMeter) return

    const wordCount = responseText.trim().split(/\s+/).length

    if (wordCount < 10) {
      setResponseQuality("poor")
      setFeedbackMessage("Please add more detail")
    } else if (wordCount < 30) {
      setResponseQuality("good")
      setFeedbackMessage("Good detail")
    } else {
      setResponseQuality("excellent")
      setFeedbackMessage("Excellent detail!")
    }
  }, [responseText, showProgressMeter])

  // Quality indicators with icons
  const qualityIndicators = {
    poor: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />,
      progressIcon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    good: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      icon: <ThumbsUp className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />,
      progressIcon: <ThumbsUp className="h-4 w-4 text-yellow-500" />,
    },
    excellent: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <Star className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />,
      progressIcon: <Star className="h-4 w-4 text-green-500" />,
    },
  }

  // Calculate the actual completed questions count
  const completedCount = Math.min(currentKeyQuestionNumber, totalKeyQuestions)

  // Determine if all questions are completed
  const allQuestionsCompleted = completedCount === totalKeyQuestions

  // Render the progress meter if enabled
  const renderProgressMeter = () => {
    if (!showProgressMeter) return null

    const { bg, text, icon, progressIcon } = qualityIndicators[responseQuality]

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center my-2 w-full`}
      >
        <div className={`${bg} ${text} px-4 py-2 rounded-lg shadow-sm flex items-center w-full max-w-md`}>
          {icon}
          <div className="flex-1">
            <p className="text-sm font-medium">{feedbackMessage}</p>
            <div className="mt-1.5 flex items-center">
              <div className="h-1.5 bg-gray-200 rounded-full flex-1 overflow-hidden">
                <motion.div
                  className={`h-full ${
                    responseQuality === "poor"
                      ? "bg-red-500"
                      : responseQuality === "good"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{
                    width: responseQuality === "poor" ? "33%" : responseQuality === "good" ? "66%" : "100%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex ml-2 space-x-1">
                <div className={`p-0.5 rounded-full ${responseQuality === "poor" ? "bg-red-100" : "bg-gray-100"}`}>
                  {qualityIndicators.poor.progressIcon}
                </div>
                <div className={`p-0.5 rounded-full ${responseQuality === "good" ? "bg-yellow-100" : "bg-gray-100"}`}>
                  {qualityIndicators.good.progressIcon}
                </div>
                <div
                  className={`p-0.5 rounded-full ${responseQuality === "excellent" ? "bg-green-100" : "bg-gray-100"}`}
                >
                  {qualityIndicators.excellent.progressIcon}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Get appropriate celebration message based on completion status
  const getCelebrationMessage = () => {
    if (allQuestionsCompleted) {
      return "All key questions completed!"
    } else if (isLastQuestion) {
      return "Final key question completed!"
    } else {
      return "Thanks for the feedback!"
    }
  }

  return (
    <>
      {/* Show progress meter when typing */}
      {isTyping && renderProgressMeter()}

      {/* Show celebration when question is completed */}
      {!isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center my-4 w-full"
        >
          <div
            className={`${
              allQuestionsCompleted ? "bg-green-100" : "bg-green-50"
            } text-green-700 px-4 py-3 rounded-lg shadow-sm flex items-center w-full max-w-md`}
          >
            {allQuestionsCompleted ? (
              <Award className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{getCelebrationMessage()}</p>
              <p className="text-xs mt-0.5">
                {completedCount} of {totalKeyQuestions} key questions completed
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
