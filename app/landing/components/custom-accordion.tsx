"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  value: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function CustomAccordionItem({ value, title, children, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("border-b", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 md:py-4 text-left font-medium transition-all hover:underline"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", isOpen ? "max-h-96" : "max-h-0")}>
        <div className="pb-3 md:pb-4 pt-0">{children}</div>
      </div>
    </div>
  )
}

interface CustomAccordionProps {
  className?: string
  children: React.ReactNode
}

export function CustomAccordion({ className, children }: CustomAccordionProps) {
  return <div className={cn("w-full", className)}>{children}</div>
}
