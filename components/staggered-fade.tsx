"use client"

import type React from "react"

import { useEffect, useState, useRef, Children, cloneElement, isValidElement } from "react"
import { cn } from "@/lib/utils"

interface StaggeredFadeProps {
  children: React.ReactNode
  className?: string
  baseDelay?: number
  staggerDelay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  threshold?: number
  once?: boolean
}

export function StaggeredFade({
  children,
  className,
  baseDelay = 0,
  staggerDelay = 100,
  duration = 500,
  direction = "up",
  threshold = 0.1,
  once = true,
}: StaggeredFadeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once && domRef.current) {
              observer.unobserve(domRef.current)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      { threshold },
    )

    const currentRef = domRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [once, threshold])

  const directionClasses = {
    up: "translate-y-8",
    down: "translate-y-[-8px]",
    left: "translate-x-8",
    right: "translate-x-[-8px]",
    none: "",
  }

  const childrenArray = Children.toArray(children)

  return (
    <div ref={domRef} className={className}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              "transition-all",
              isVisible ? "opacity-100 transform-none" : `opacity-0 ${directionClasses[direction]}`,
            ),
            style: {
              ...child.props.style,
              transitionProperty: "opacity, transform",
              transitionDuration: `${duration}ms`,
              transitionDelay: `${baseDelay + index * staggerDelay}ms`,
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
          })
        }
        return child
      })}
    </div>
  )
}
