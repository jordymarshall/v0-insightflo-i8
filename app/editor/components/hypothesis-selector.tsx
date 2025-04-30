"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Hypothesis {
  id: string
  text: string
  isTestable?: boolean
}

interface HypothesisSelectorProps {
  hypotheses: Hypothesis[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  maxHeight?: string
  className?: string
}

export default function HypothesisSelector({
  hypotheses,
  selectedIds,
  onChange,
  maxHeight = "250px",
  className,
}: HypothesisSelectorProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, id])
    } else {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSelectAll = () => {
    if (selectedIds.length === hypotheses.length) {
      // If all are selected, deselect all
      onChange([])
    } else {
      // Otherwise, select all
      onChange(hypotheses.map((h) => h.id))
    }
  }

  // Function to extract hypothesis number from text
  const extractHypothesisNumber = (index: number): string => {
    return `H${index + 1}: `
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Color options for hypotheses
  const colorOptions = [
    {
      bg: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      selectedBg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      check: "text-blue-600",
    },
    {
      bg: "bg-purple-50",
      hoverBg: "hover:bg-purple-100",
      selectedBg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
      check: "text-purple-600",
    },
    {
      bg: "bg-green-50",
      hoverBg: "hover:bg-green-100",
      selectedBg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      check: "text-green-600",
    },
    {
      bg: "bg-amber-50",
      hoverBg: "hover:bg-amber-100",
      selectedBg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      check: "text-amber-600",
    },
    {
      bg: "bg-rose-50",
      hoverBg: "hover:bg-rose-100",
      selectedBg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
      check: "text-rose-600",
    },
    {
      bg: "bg-indigo-50",
      hoverBg: "hover:bg-indigo-100",
      selectedBg: "bg-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-200",
      check: "text-indigo-600",
    },
    {
      bg: "bg-cyan-50",
      hoverBg: "hover:bg-cyan-100",
      selectedBg: "bg-cyan-100",
      text: "text-cyan-700",
      border: "border-cyan-200",
      check: "text-cyan-600",
    },
  ]

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select all hypotheses this question helps test</h3>
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        >
          {selectedIds.length === hypotheses.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto border rounded-md p-3 bg-white" style={{ maxHeight }}>
        {hypotheses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-2">No hypotheses available</p>
        ) : (
          hypotheses.map((hypothesis, index) => {
            const isSelected = selectedIds.includes(hypothesis.id)
            const isExpanded = expandedIds[hypothesis.id]
            const isHovered = hoveredId === hypothesis.id
            const color = colorOptions[index % colorOptions.length]
            const hypothesisNumber = extractHypothesisNumber(index)

            return (
              <motion.div
                key={hypothesis.id}
                className={cn(
                  "relative rounded-md border-2 transition-all duration-200 cursor-pointer",
                  isSelected ? `${color.selectedBg} ${color.border}` : "border-transparent",
                  isHovered && !isSelected ? color.hoverBg : "",
                  "hover:shadow-sm",
                )}
                onMouseEnter={() => setHoveredId(hypothesis.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={cn("flex items-start gap-3 p-3 rounded-md", !isSelected && `${color.bg}`)}
                  onClick={(e) => {
                    // Only toggle if not clicking on the checkbox or expand button
                    if (
                      e.target instanceof HTMLElement &&
                      !e.target.closest("button") &&
                      !e.target.closest('[role="checkbox"]')
                    ) {
                      handleToggle(hypothesis.id, !isSelected)
                    }
                  }}
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <Checkbox
                      id={`hypothesis-${hypothesis.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleToggle(hypothesis.id, checked === true)}
                      className={cn(
                        "h-4 w-4 rounded-sm border-2",
                        color.border,
                        isSelected ? color.bg : "bg-white",
                        "[&:checked]:bg-transparent [&:checked]:border-current [&:checked]:[--checkbox-check:transparent]",
                      )}
                    />
                    {isSelected && <Check className={cn("h-3 w-3 absolute pointer-events-none", color.check)} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Label
                        htmlFor={`hypothesis-${hypothesis.id}`}
                        className={cn(
                          "text-sm cursor-pointer font-medium",
                          color.text,
                          isExpanded ? "line-clamp-none" : "line-clamp-2",
                        )}
                      >
                        <span className="font-bold">{hypothesisNumber}</span>
                        {isExpanded ? hypothesis.text : truncateText(hypothesis.text, 100)}
                      </Label>

                      <button
                        onClick={(e) => toggleExpand(hypothesis.id, e)}
                        className={cn(
                          "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                          color.text,
                          "hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-1",
                          color.border,
                        )}
                        aria-label={isExpanded ? "Collapse hypothesis" : "Expand hypothesis"}
                      >
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {/* Visual indicator for selected state */}
                    {isSelected && (
                      <div className={cn("h-1 w-12 mt-2 rounded-full", color.selectedBg, color.border)}></div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
