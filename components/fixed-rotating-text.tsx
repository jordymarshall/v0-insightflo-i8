"use client"

import { useState, useEffect, useRef } from "react"

interface FixedRotatingTextProps {
  phrases: string[]
  staticText: string
  interval?: number
}

export function FixedRotatingText({ phrases, staticText, interval = 3000 }: FixedRotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [maxWidth, setMaxWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate the maximum width needed for all phrases on initial load
  useEffect(() => {
    const calculateMaxWidth = () => {
      if (containerRef.current) {
        // Create a temporary span to measure text width
        const tempSpan = document.createElement("span")
        tempSpan.style.visibility = "hidden"
        tempSpan.style.position = "absolute"
        tempSpan.style.fontSize = window.getComputedStyle(containerRef.current).fontSize
        tempSpan.style.fontWeight = "bold"
        document.body.appendChild(tempSpan)

        // Find the width for the longest phrase
        let widestWidth = 0
        phrases.forEach((phrase) => {
          tempSpan.textContent = phrase
          const width = tempSpan.getBoundingClientRect().width
          widestWidth = Math.max(widestWidth, width)
        })

        // Add padding for comfortable spacing
        setMaxWidth(widestWidth + 20)
        setContainerWidth(widestWidth + 20)
        document.body.removeChild(tempSpan)
      }
    }

    calculateMaxWidth()

    // Add resize listener
    window.addEventListener("resize", calculateMaxWidth)
    return () => window.removeEventListener("resize", calculateMaxWidth)
  }, [phrases])

  // Update width for current phrase
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Create a temporary span to measure text width
        const tempSpan = document.createElement("span")
        tempSpan.style.visibility = "hidden"
        tempSpan.style.position = "absolute"
        tempSpan.style.fontSize = window.getComputedStyle(containerRef.current).fontSize
        tempSpan.style.fontWeight = "bold"
        document.body.appendChild(tempSpan)

        // Find the width for current phrase
        tempSpan.textContent = phrases[currentIndex]
        const currentWidth = tempSpan.getBoundingClientRect().width

        // Add padding for comfortable spacing
        setContainerWidth(currentWidth + 20)
        document.body.removeChild(tempSpan)
      }
    }

    // Only update width if not animating
    if (!isAnimating) {
      updateWidth()
    }
  }, [phrases, currentIndex, isAnimating])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex((nextIndex + 1) % phrases.length)
        setIsAnimating(false)
      }, 500)
    }, interval)

    return () => clearInterval(intervalId)
  }, [interval, phrases.length, nextIndex])

  return (
    <div className="flex items-center justify-center">
      {/* Container for rotating text - using maxWidth initially */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          width: `${containerWidth}px`,
          minWidth: `${maxWidth}px`, // Use maxWidth as minWidth to prevent stacking
          height: "1.2em",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-end",
          transition: "width 0.3s ease-out",
        }}
      >
        {/* Current visible text */}
        <div
          className={`absolute inset-0 flex items-center justify-end ${isAnimating ? "animate-slide-up" : ""}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-gray-900 dark:text-gray-200" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            {phrases[currentIndex]}
          </span>
        </div>

        {/* Next text waiting to slide up */}
        {isAnimating && (
          <div
            className="absolute inset-0 flex items-center justify-end animate-slide-up-from-bottom"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-gray-900 dark:text-gray-200" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              {phrases[nextIndex]}
            </span>
          </div>
        )}
      </div>

      {/* Static text with fixed spacing and enhanced readability */}
      <div
        className="ml-2 bg-gradient-to-r from-purple-500 via-violet-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap flex items-center"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
      >
        {staticText}
      </div>
    </div>
  )
}
