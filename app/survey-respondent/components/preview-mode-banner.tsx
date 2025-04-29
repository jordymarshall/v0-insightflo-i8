"use client"

import { motion } from "framer-motion"
import { Eye, X } from "lucide-react"
import { useState } from "react"

interface PreviewModeBannerProps {
  onClose?: () => void
  showCloseButton?: boolean
  onSkipForward?: () => void
  onSkipBack?: () => void
}

export default function PreviewModeBanner({
  onClose,
  showCloseButton = true,
  onSkipForward,
  onSkipBack,
}: PreviewModeBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-blue-600 text-white shadow-md transition-all duration-300 ${isMinimized ? "h-8" : "py-2 sm:py-3"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span className={`font-medium ${isMinimized ? "text-sm" : "text-sm sm:text-base"}`}>
            Preview Mode - No data will be saved
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {!isMinimized && (
            <>
              {onSkipBack && (
                <button
                  onClick={onSkipBack}
                  className="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded text-white transition-colors flex items-center"
                  aria-label="Skip to previous question"
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
                    className="h-3 w-3 mr-1"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back
                </button>
              )}

              {onSkipForward && (
                <button
                  onClick={onSkipForward}
                  className="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded text-white transition-colors flex items-center"
                  aria-label="Skip to next question"
                >
                  Next
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
                    className="h-3 w-3 ml-1"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              )}
            </>
          )}

          {isMinimized && (
            <button
              onClick={toggleMinimize}
              className="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-0.5 rounded text-white transition-colors"
              aria-label="Expand preview banner"
            >
              Expand
            </button>
          )}

          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Exit preview mode"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-1 text-xs sm:text-sm text-blue-100">
          This is a preview of how your survey will appear to respondents. Any actions taken here will not be recorded.
        </div>
      )}
    </motion.div>
  )
}
