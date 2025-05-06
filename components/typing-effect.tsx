"use client"

import { useState, useEffect, useCallback } from "react"

interface TypingEffectProps {
  texts: string[]
  delay?: number
  className?: string
  onComplete?: () => void
  pauseBetweenTexts?: number
  eraseDelay?: number
}

export function TypingEffect({
  texts,
  delay = 50,
  className = "",
  onComplete,
  pauseBetweenTexts = 2000,
  eraseDelay = 20,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isErasing, setIsErasing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const currentText = texts[textIndex]

  const eraseText = useCallback(() => {
    setIsErasing(true)
    setIsTyping(false)

    // Fade out the text
    setOpacity(0)

    // After fade out completes, reset and prepare for next text
    setTimeout(() => {
      setDisplayText("")
      setIsErasing(false)
      setTextIndex((prev) => (prev + 1) % texts.length)
      setCurrentIndex(0)
      setIsPaused(true)

      // Pause before starting to type the next text
      setTimeout(() => {
        setOpacity(1) // Reset opacity before typing starts
        setIsPaused(false)
        setIsTyping(true)
      }, 500)
    }, 800) // Match with CSS transition duration

    return () => {}
  }, [texts])

  // Handle typing effect
  useEffect(() => {
    if (!isTyping || isErasing || isPaused) return

    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else {
      // Finished typing current text
      setTimeout(() => {
        eraseText()
      }, pauseBetweenTexts)
    }
  }, [currentIndex, delay, currentText, isTyping, isErasing, isPaused, pauseBetweenTexts, eraseText])

  return (
    <span
      className={`${className} pointer-events-none`}
      style={{
        opacity,
        transition: "opacity 800ms ease-out",
        display: "block",
      }}
    >
      {displayText}
    </span>
  )
}
