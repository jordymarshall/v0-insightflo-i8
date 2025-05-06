"use client"

import type React from "react"
import { useEffect, useRef, useState, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, Loader2, SkipForward, AlertCircle, ThumbsUp, Star } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AnswerInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSkip?: () => void
  isSubmitting: boolean
  required: boolean
  placeholder?: string
}

const AnswerInput = forwardRef<HTMLTextAreaElement, AnswerInputProps>(
  (
    { value, onChange, onSubmit, onSkip, isSubmitting, required, placeholder = "Share your thoughts..." },
    forwardedRef,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const ref = forwardedRef ?? textareaRef // use external or fallback
    const isMobile = useMediaQuery("(max-width: 640px)")
    const [responseQuality, setResponseQuality] = useState<"poor" | "good" | "excellent">("poor")
    const [feedbackMessage, setFeedbackMessage] = useState<string>("")
    const [indicatorWidth, setIndicatorWidth] = useState(0)
    const indicatorRef = useRef<HTMLDivElement>(null)

    // Auto-focus the textarea when the component mounts
    useEffect(() => {
      const textarea = ref && "current" in ref ? ref.current : null
      if (textarea) {
        textarea.focus()
      }
    }, [ref])

    // Measure the width of the quality indicator to set proper padding
    useEffect(() => {
      if (indicatorRef.current) {
        const width = indicatorRef.current.offsetWidth
        setIndicatorWidth(width + 16) // Add some extra padding
      }
    }, [responseQuality, value])

    // Auto-resize textarea as user types
    useEffect(() => {
      const textarea = ref && "current" in ref ? ref.current : null
      if (!textarea) return

      const adjustHeight = () => {
        textarea.style.height = "auto"
        const maxHeight = isMobile ? 187 : 250 // Increased by 25% from 150 and 200
        textarea.style.height = `${Math.min(maxHeight, Math.max(125, textarea.scrollHeight))}px` // Increased from 100 to 125
      }

      // Set initial height
      adjustHeight()

      // Add event listener for input changes
      textarea.addEventListener("input", adjustHeight)

      // Cleanup
      return () => {
        textarea.removeEventListener("input", adjustHeight)
      }
    }, [isMobile, ref])

    // Evaluate response quality based on text length
    useEffect(() => {
      const wordCount = value.trim().split(/\s+/).length

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
    }, [value])

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if ((!required || (required && value.trim())) && responseQuality !== "poor") {
        onSubmit()
      }
    }

    // Handle Enter key press - only submit on Ctrl+Enter or Cmd+Enter to allow for multiline input
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if ((!required || (required && value.trim())) && responseQuality !== "poor") {
          onSubmit()
        }
      }
    }

    // Quality indicators with icons
    const qualityIndicators = {
      poor: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      },
      good: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        icon: <ThumbsUp className="h-4 w-4 text-yellow-500" />,
      },
      excellent: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: <Star className="h-4 w-4 text-green-500" />,
      },
    }

    // Calculate right padding based on whether we have skip button
    const rightPadding = !required && onSkip ? "pr-[120px]" : "pr-[60px]"

    return (
      <form onSubmit={handleSubmit} className="relative placeholder-top bg-white shadow-md rounded-t-lg">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`min-h-[125px] resize-none rounded-2xl text-base leading-relaxed ${rightPadding} apple-input break-words pt-10 scrollbar-hide overflow-y-auto max-h-40 sm:max-h-52`}
          style={{
            fontSize: "16px",
            lineHeight: "1.5em",
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
            WebkitOverflowScrolling: "touch",
          }}
          disabled={isSubmitting}
          aria-required={required}
          aria-label="Your response"
        />

        {/* Required/Not Required indicator - always show */}
        <div className="absolute top-2 left-4 text-xs px-2 py-1 rounded-full z-20 shadow-sm bg-gray-50 text-gray-500">
          {required || (!onSkip && value.trim().length === 0) ? "Required" : "Not Required"}
        </div>

        {/* Quality indicator */}
        {value.trim() && (
          <div
            ref={indicatorRef}
            className={`absolute top-2 right-4 ${qualityIndicators[responseQuality].bg} ${qualityIndicators[responseQuality].text} px-2 py-1 rounded-full text-xs flex items-center gap-1 z-20 shadow-sm`}
          >
            {qualityIndicators[responseQuality].icon}
            {feedbackMessage}
          </div>
        )}

        {/* Action buttons container */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* Skip button if available */}
          {!required && onSkip && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-10 px-3 text-sm rounded-full border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 flex items-center apple-button apple-button-secondary"
              onClick={onSkip}
              disabled={isSubmitting}
              aria-label="Skip this question"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          )}

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            className={`h-10 w-10 rounded-full p-0 flex items-center justify-center apple-button ${
              responseQuality === "poor"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 apple-button-primary"
            }`}
            disabled={isSubmitting || (required && !value.trim()) || responseQuality === "poor"}
            aria-label="Send your response"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    )
  },
)

AnswerInput.displayName = "AnswerInput"

export default AnswerInput
