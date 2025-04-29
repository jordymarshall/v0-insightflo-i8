"use client"

import type React from "react"

import { useIsMobile } from "../hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ContentWrapperProps {
  children: React.ReactNode
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        "flex-1 overflow-auto relative",
        "transition-all duration-300 ease-in-out",
        isMobile ? "w-full" : "w-[calc(100%-4rem)]",
        isMobile ? "ml-0" : "ml-16",
      )}
    >
      <div className="min-h-full w-full px-6">{children}</div>
    </div>
  )
}
