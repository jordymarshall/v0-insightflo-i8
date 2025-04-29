"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Check, Lightbulb, AlertTriangle, CheckCircle2, ChevronDown, Sparkles, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Hypothesis } from "./hypotheses-band"

interface HypothesisCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (hypothesis: Hypothesis) => void
  initialHypothesis?: Hypothesis
}

export default function HypothesisCreator({ isOpen, onClose, onSave, initialHypothesis }: HypothesisCreatorProps) {
  const [hypothesisText, setHypothesisText] = useState(initialHypothesis?.text || "")
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const isTestable = (text: string): boolean => {
    // Simple check: Hypothesis should be at least 10 characters and contain "because" or similar causal language
    return (
      text.length >= 10 &&
      (text.toLowerCase().includes("because") ||
        text.toLowerCase().includes("due to") ||
        text.toLowerCase().includes("as a result of"))
    )
  }

  const handleSave = () => {
    if (hypothesisText.trim()) {
      onSave({
        id: initialHypothesis?.id || Date.now().toString(),
        text: hypothesisText.trim(),
        isTestable: isTestable(hypothesisText),
      })
      onClose()
    }
  }

  const generateHypothesis = () => {
    setIsLoadingAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "We believe that users abandon the onboarding process because there are too many form fields to complete in one session.",
        "We believe that new users struggle to find key features because our navigation structure doesn't match their mental model.",
        "We believe that customer support requests increase after updates because our release notes don't effectively communicate changes.",
        "We believe that users don't engage with our analytics dashboard because the data visualization is too complex for non-technical users.",
        "We believe that trial users don't convert to paid plans because they don't experience the full value proposition during the trial period.",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      setHypothesisText(randomSuggestion)
      setIsLoadingAI(false)
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">{initialHypothesis ? "Edit Hypothesis" : "Create New Hypothesis"}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="hypothesis-text" className="block text-sm font-medium">
                    Hypothesis Statement
                  </label>
                  <div className="relative">
                    <Textarea
                      id="hypothesis-text"
                      value={hypothesisText}
                      onChange={(e) => setHypothesisText(e.target.value)}
                      placeholder="We believe that... because..."
                      className="min-h-[100px] resize-none pr-10"
                      autoFocus
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute bottom-2 right-2 h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={generateHypothesis}
                            disabled={isLoadingAI}
                          >
                            {isLoadingAI ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Get AI Suggestion</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {hypothesisText.length > 0 && !isTestable(hypothesisText) && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium">This hypothesis may not be testable yet</p>
                      <p className="mt-1">
                        Try including a clear cause-and-effect relationship using words like "because" or "due to".
                      </p>
                    </div>
                  </div>
                )}

                {hypothesisText.length > 0 && isTestable(hypothesisText) && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Great! This hypothesis looks testable</p>
                      <p className="mt-1">
                        It includes a clear cause-and-effect relationship that can be tested with your questions.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div
                    className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-t-md cursor-pointer hover:bg-blue-100/50 transition-colors"
                    onClick={() => document.getElementById("tips-collapse")?.classList.toggle("hidden")}
                  >
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800 flex-1">Writing Tips</h4>
                    <ChevronDown className="h-4 w-4 text-blue-600" id="tips-chevron" />
                  </div>

                  <div
                    id="tips-collapse"
                    className="hidden p-4 bg-white border border-t-0 border-blue-100 rounded-b-md"
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-blue-800">Structure</h5>
                          <ul className="space-y-2 text-sm text-gray-700 pl-5 list-disc">
                            <li>
                              <strong>Start with "We believe that..."</strong>
                            </li>
                            <li>
                              <strong>Include "because..."</strong> to show causality
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-blue-800">Quality</h5>
                          <ul className="space-y-2 text-sm text-gray-700 pl-5 list-disc">
                            <li>
                              Be <strong>specific</strong> and <strong>falsifiable</strong>
                            </li>
                            <li>
                              Focus on <strong>one relationship</strong> at a time
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50 rounded-md p-3 border border-blue-200">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Example:</h5>
                        <p className="text-sm text-blue-700 italic">
                          "We believe that users abandon the onboarding process <strong>because</strong> there are too
                          many form fields to complete in one session."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <Button onClick={handleSave} disabled={!hypothesisText.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Check className="h-4 w-4 mr-1" />
                {initialHypothesis ? "Update" : "Create"} Hypothesis
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
