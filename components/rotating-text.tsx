"use client"

import { useState, useEffect } from "react"

interface RotatingTextProps {
  phrases: string[]
  staticText: string
  interval?: number
}

export function RotatingText({ phrases, staticText, interval = 3000 }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start fade out
      setIsVisible(false)

      // Change text and fade in after a short delay
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        setIsVisible(true)
      }, 500) // Half a second for fade out
    }, interval)

    return () => clearInterval(intervalId)
  }, [phrases, interval])

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* The entire phrase rotates, with "on Autopilot" always in the same position */}
      <div className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <span className="text-gray-900 dark:text-gray-200">{phrases[currentIndex]}</span>{" "}
        <span className="bg-gradient-to-r from-purple-500 via-violet-400 to-blue-400 bg-clip-text text-transparent">
          {staticText}
        </span>
      </div>
    </div>
  )
}
