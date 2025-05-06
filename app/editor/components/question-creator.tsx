"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  X,
  Check,
  Lightbulb,
  ToggleRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"

interface QuestionCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: Question) => void
  initialQuestion?: Question
  hypotheses: Hypothesis[]
  hypothesisId?: string
}

export default function QuestionCreator({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
  hypotheses,
  hypothesisId,
}: QuestionCreatorProps) {
  const [title, setTitle] = useState(initialQuestion?.title || "")
  const [description, setDescription] = useState(initialQuestion?.description || "")
  const [required, setRequired] = useState(initialQuestion?.required || false)
  const [aiFollowUpEnabled, setAiFollowUpEnabled] = useState(initialQuestion?.aiFollowUp?.enabled || false)
  const [selectedHypothesisIds, setSelectedHypothesisIds] = useState<string[]>(
    initialQuestion?.hypothesisIds || (hypothesisId ? [hypothesisId] : []),
  )
  const [expandedHypotheses, setExpandedHypotheses] = useState<Record<string, boolean>>({})

  // Add state for AI suggestion loading
  const [isLoadingTitleAI, setIsLoadingTitleAI] = useState(false)
  const [isLoadingDescriptionAI, setIsLoadingDescriptionAI] = useState(false)

  // Add generateQuestionTitle function
  const generateQuestionTitle = () => {
    setIsLoadingTitleAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "What specific challenges have you encountered when using our product?",
        "How would you describe your experience with our customer support team?",
        "What features would you like to see improved in our product?",
        "What was your main goal when you first started using our product?",
        "How has our product helped you solve problems in your workflow?",
        "What aspects of our product do you find most valuable?",
        "If you could change one thing about our product, what would it be?",
        "How does our product compare to alternatives you've tried?",
        "What was your biggest surprise when using our product?",
        "What would make you recommend our product to others?",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      setTitle(randomSuggestion)
      setIsLoadingTitleAI(false)
    }, 1200)
  }

  // Add generateQuestionDescription function
  const generateQuestionDescription = () => {
    setIsLoadingDescriptionAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "We're looking to understand specific pain points to prioritize our development roadmap.",
        "Your feedback helps us improve our training and support processes.",
        "Please be as specific as possible to help us understand your needs better.",
        "We want to ensure our product aligns with your workflow and expectations.",
        "This helps us understand how our product fits into your daily activities.",
        "Your insights will directly influence our product development priorities.",
        "Feel free to share both positive and negative experiences.",
        "We're particularly interested in how this affects your day-to-day work.",
        "Your perspective helps us better understand user needs and expectations.",
        "This information helps us create a better experience for all users.",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      setDescription(randomSuggestion)
      setIsLoadingDescriptionAI(false)
    }, 1000)
  }

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        id: initialQuestion?.id || Date.now().toString(),
        type: "conversational_question",
        title: title.trim(),
        description: description.trim() || undefined,
        required,
        hypothesisIds: selectedHypothesisIds.length > 0 ? selectedHypothesisIds : undefined,
        aiFollowUp: {
          enabled: aiFollowUpEnabled,
          probeDepth: initialQuestion?.aiFollowUp?.probeDepth || "medium",
          customDepth: initialQuestion?.aiFollowUp?.customDepth || 50,
        },
      })
      onClose()
    }
  }

  const handleHypothesisChange = (hypothesisId: string, checked: boolean) => {
    if (checked) {
      setSelectedHypothesisIds((prev) => [...prev, hypothesisId])
    } else {
      setSelectedHypothesisIds((prev) => prev.filter((id) => id !== hypothesisId))
    }
  }

  const toggleHypothesis = (hypothesisId: string) => {
    const isSelected = selectedHypothesisIds.includes(hypothesisId)
    handleHypothesisChange(hypothesisId, !isSelected)
  }

  const toggleExpandHypothesis = (hypothesisId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedHypotheses((prev) => ({
      ...prev,
      [hypothesisId]: !prev[hypothesisId],
    }))
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const isGoodQuestion = (text: string): boolean => {
    // Simple check: Question should be at least 10 characters and end with a question mark
    return text.length >= 10 && text.trim().endsWith("?")
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
            className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">{initialQuestion ? "Edit Question" : "Create New Question"}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              <div className="space-y-4">
                {hypotheses.length > 0 && (
                  <div className="space-y-2 relative">
                    <label className="block text-sm font-medium">Related Hypotheses</label>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Select which hypotheses this question helps test:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          // If all are selected, deselect all. Otherwise, select all.
                          const allSelected = hypotheses.every((h) => selectedHypothesisIds.includes(h.id))
                          if (allSelected) {
                            setSelectedHypothesisIds([])
                          } else {
                            const allIds = hypotheses.map((h) => h.id)
                            setSelectedHypothesisIds(allIds)
                          }
                        }}
                      >
                        {hypotheses.every((h) => selectedHypothesisIds.includes(h.id)) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto border rounded-md p-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {hypotheses.map((hypothesis, index) => {
                        // Get a consistent color for this hypothesis
                        const colorOptions = [
                          {
                            bg: "bg-blue-50",
                            text: "text-blue-700",
                            border: "border-blue-200",
                            check: "text-blue-600",
                          },
                          {
                            bg: "bg-purple-50",
                            text: "text-purple-700",
                            border: "border-purple-200",
                            check: "text-purple-600",
                          },
                          {
                            bg: "bg-green-50",
                            text: "text-green-700",
                            border: "border-green-200",
                            check: "text-green-600",
                          },
                          {
                            bg: "bg-amber-50",
                            text: "text-amber-700",
                            border: "border-amber-200",
                            check: "text-amber-600",
                          },
                          {
                            bg: "bg-rose-50",
                            text: "text-rose-700",
                            border: "border-rose-200",
                            check: "text-rose-600",
                          },
                          {
                            bg: "bg-indigo-50",
                            text: "text-indigo-700",
                            border: "border-indigo-200",
                            check: "text-indigo-600",
                          },
                          {
                            bg: "bg-cyan-50",
                            text: "text-cyan-700",
                            border: "border-cyan-200",
                            check: "text-cyan-600",
                          },
                        ]
                        const color = colorOptions[index % colorOptions.length]
                        const isSelected = selectedHypothesisIds.includes(hypothesis.id)
                        const isExpanded = expandedHypotheses[hypothesis.id]
                        const hypothesisLabel = `H${index + 1}: `

                        return (
                          <div
                            key={hypothesis.id}
                            className={cn(
                              "relative flex items-start p-2 rounded-md border transition-all cursor-pointer group mb-2 last:mb-0",
                              isSelected
                                ? `${color.bg} ${color.border} border-l-4`
                                : "border-gray-200 hover:bg-gray-50",
                            )}
                            onClick={() => toggleHypothesis(hypothesis.id)}
                          >
                            {/* Left color indicator */}
                            <div
                              className={cn(
                                "absolute left-0 top-0 bottom-0 w-1 rounded-l-md",
                                isSelected ? color.bg : "bg-transparent",
                              )}
                            ></div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                {isSelected && <Check className={`h-4 w-4 mr-2 ${color.check}`} />}
                                <Label
                                  className={cn(
                                    "text-sm cursor-pointer block",
                                    isSelected ? color.text : "text-gray-700",
                                  )}
                                >
                                  <span className="font-bold">{hypothesisLabel}</span>
                                  <span className="font-medium">
                                    {isExpanded ? hypothesis.text : truncateText(hypothesis.text, 60)}
                                  </span>
                                </Label>
                              </div>

                              {/* Expand/collapse button */}
                              {hypothesis.text.length > 60 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs mt-1"
                                  onClick={(e) => toggleExpandHypothesis(hypothesis.id, e)}
                                >
                                  {isExpanded ? (
                                    <span className="flex items-center">
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Show less
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      Show more
                                    </span>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      {hypotheses.length > 3 && (
                        <div className="text-xs text-center text-gray-500 py-1 border-t mt-1">
                          {hypotheses.length - 3} more {hypotheses.length - 3 === 1 ? "hypothesis" : "hypotheses"}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="question-title" className="block text-sm font-medium">
                    Question
                  </label>
                  <div className="relative">
                    <Input
                      id="question-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., What challenges have you faced with our onboarding process?"
                      className="w-full pr-10"
                      autoFocus
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-0 right-0 bottom-0 h-full w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={generateQuestionTitle}
                            disabled={isLoadingTitleAI}
                          >
                            {isLoadingTitleAI ? (
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

                {title.length > 0 && !isGoodQuestion(title) && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium">This might not be an effective question</p>
                      <p className="mt-1">
                        Make sure your question ends with a question mark and is specific enough to get meaningful
                        responses.
                      </p>
                    </div>
                  </div>
                )}

                {title.length > 0 && isGoodQuestion(title) && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Great! This looks like a good question</p>
                      <p className="mt-1">It's clear and specific.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="question-description" className="block text-sm font-medium">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <Textarea
                      id="question-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add context or clarification for the respondent"
                      className="min-h-[80px] resize-none pr-10"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute bottom-2 right-2 h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={generateQuestionDescription}
                            disabled={isLoadingDescriptionAI}
                          >
                            {isLoadingDescriptionAI ? (
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

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch id="question-required" checked={required} onCheckedChange={setRequired} />
                    <Label htmlFor="question-required">Required</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch id="ai-followup" checked={aiFollowUpEnabled} onCheckedChange={setAiFollowUpEnabled} />
                    <Label htmlFor="ai-followup" className="flex items-center gap-1">
                      <span>AI Follow-up</span>
                      <ToggleRight className="h-3.5 w-3.5 text-blue-500" />
                    </Label>
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-t-md cursor-pointer hover:bg-blue-100/50 transition-colors"
                    onClick={() => {
                      document.getElementById("question-tips-collapse")?.classList.toggle("hidden")
                      document.getElementById("tips-chevron-question")?.classList.toggle("rotate-180")
                    }}
                  >
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800 flex-1">Writing Tips</h4>
                    <ChevronDown
                      className="h-4 w-4 text-blue-600 transition-transform duration-200"
                      id="tips-chevron-question"
                    />
                  </div>

                  <div
                    id="question-tips-collapse"
                    className="hidden p-4 bg-white border border-t-0 border-blue-100 rounded-b-md"
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-blue-800">Do:</h5>
                          <ul className="space-y-2 text-sm text-gray-700 pl-5 list-disc">
                            <li>
                              Use <strong>open-ended</strong> questions
                            </li>
                            <li>
                              Be <strong>specific</strong> and <strong>clear</strong>
                            </li>
                            <li>
                              Use <strong>neutral</strong> language
                            </li>
                            <li>
                              Focus on <strong>one topic</strong> per question
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-blue-800">Don't:</h5>
                          <ul className="space-y-2 text-sm text-gray-700 pl-5 list-disc">
                            <li>
                              Ask <strong>leading</strong> questions
                            </li>
                            <li>
                              Use <strong>jargon</strong> or complex language
                            </li>
                            <li>
                              Ask <strong>double-barreled</strong> questions
                            </li>
                            <li>
                              Make <strong>assumptions</strong>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50 rounded-md p-3 border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <h5 className="text-sm font-medium text-green-800 mb-1">Good:</h5>
                            <p className="text-sm text-blue-700 italic">
                              "What challenges have you faced when using our product?"
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-800 mb-1">Poor:</h5>
                            <p className="text-sm text-blue-700 italic">
                              "Don't you agree that our product is easy to use and has great features?"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <Button onClick={handleSave} disabled={!title.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Check className="h-4 w-4 mr-1" />
                {initialQuestion ? "Update" : "Create"} Question
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
