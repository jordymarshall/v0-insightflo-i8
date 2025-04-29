"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Plus, Trash2, HelpCircle, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export interface Hypothesis {
  id: string
  text: string
  isTestable: boolean
}

interface HypothesesBandProps {
  isExpanded: boolean
  onToggleExpand: () => void
  hypotheses: Hypothesis[]
  onHypothesesChange: (hypotheses: Hypothesis[]) => void
}

export default function HypothesesBand({
  isExpanded,
  onToggleExpand,
  hypotheses,
  onHypothesesChange,
}: HypothesesBandProps) {
  const [editingHypothesisId, setEditingHypothesisId] = useState<string | null>(null)
  const [draggingHypothesis, setDraggingHypothesis] = useState<Hypothesis | null>(null)

  const addHypothesis = () => {
    const newHypothesis: Hypothesis = {
      id: Date.now().toString(),
      text: "",
      isTestable: false,
    }
    onHypothesesChange([...hypotheses, newHypothesis])
    setEditingHypothesisId(newHypothesis.id)
  }

  const updateHypothesis = (id: string, text: string) => {
    onHypothesesChange(
      hypotheses.map((hypothesis) => {
        if (hypothesis.id === id) {
          return {
            ...hypothesis,
            text,
            isTestable: checkIfTestable(text),
          }
        }
        return hypothesis
      }),
    )
  }

  const removeHypothesis = (id: string) => {
    onHypothesesChange(hypotheses.filter((hypothesis) => hypothesis.id !== id))
  }

  const checkIfTestable = (text: string): boolean => {
    // Simple check: Hypothesis should be at least 10 characters and contain "because" or similar causal language
    return (
      text.length >= 10 &&
      (text.toLowerCase().includes("because") ||
        text.toLowerCase().includes("due to") ||
        text.toLowerCase().includes("as a result of"))
    )
  }

  const handleDragStart = (e: React.DragEvent, hypothesis: Hypothesis) => {
    e.dataTransfer.setData("hypothesisId", hypothesis.id)
    // Add text/plain format for compatibility with the question card direct drop
    e.dataTransfer.setData("text/plain", `hypothesis:${hypothesis.id}`)
    e.dataTransfer.effectAllowed = "link"
    setDraggingHypothesis(hypothesis)
  }

  return (
    <div
      className={cn(
        "border-b bg-white transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "pb-4" : "",
      )}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={onToggleExpand}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-800">Hypotheses</h3>
          <span className="text-sm text-gray-500">(What We Believe)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {hypotheses.length} {hypotheses.length === 1 ? "hypothesis" : "hypotheses"}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700">Research Hypotheses</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Develop clear, testable hypotheses. For example: "We believe users are dropping off due to
                        complexity in onboarding."
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  addHypothesis()
                }}
                className="h-7 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Hypothesis
              </Button>
            </div>

            <div className="space-y-3">
              {hypotheses.map((hypothesis, index) => (
                <div
                  key={hypothesis.id}
                  className="border rounded-lg p-3 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, hypothesis)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="mb-1 font-medium text-sm text-blue-700">H{index + 1}</div>
                        <Textarea
                          value={hypothesis.text}
                          onChange={(e) => updateHypothesis(hypothesis.id, e.target.value)}
                          placeholder="We believe that... because..."
                          className="min-h-[60px] resize-none border-gray-200 focus-visible:ring-blue-400 text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHypothesis(hypothesis.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-end">
                      {hypothesis.isTestable ? (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border-green-100"
                        >
                          <Check className="h-3 w-3" />
                          <span>Testable</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border-amber-100"
                        >
                          <X className="h-3 w-3" />
                          <span>Not testable yet</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {hypotheses.length === 0 && (
                <div className="border border-dashed rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">
                    No hypotheses yet. Add hypotheses to guide your research questions.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
