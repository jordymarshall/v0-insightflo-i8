"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Question } from "../types/survey-types"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// Add imports for the arrow icons
import {
  ArrowUp,
  ArrowDown,
  Grip,
  Trash2,
  MessageSquare,
  Pencil,
  X,
  Check,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Add these imports at the top
import { motion } from "framer-motion"
// Add import for QuestionSettings
import QuestionSettings from "./question-settings"
// Add these imports at the top
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AISuggestionModal from "./ai-suggestion-modal"

// Define the Hypothesis type
interface Hypothesis {
  id: string
  text: string
  isTestable?: boolean
}

// Replace these interfaces
// interface QuestionWithSecondaryHypotheses extends Question {
//   secondaryHypothesisIds?: string[]
// }

// With this
interface QuestionWithHypotheses extends Question {
  hypothesisIds?: string[]
}

// Update the QuestionCardProps interface to include move up/down handlers
interface QuestionCardProps {
  question: QuestionWithHypotheses
  isSelected: boolean
  onSelect: () => void
  onUpdate: (question: Question) => void
  onDelete: () => void
  showSettings: boolean
  onToggleSettings: () => void
  hypotheses?: Hypothesis[] // Make this optional
  onLinkHypothesis?: (questionId: string, hypothesisIds: string[]) => void // Make this optional
  hypothesisColors?: Record<string, { bg: string; text: string; border: string }> // Add this prop
  surveyContext?: {
    problemStatement: string
    successCriteria: string
    targetUsers: string
  }
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onMoveUp?: () => void // Add this prop
  onMoveDown?: () => void // Add this prop
  isFirst?: boolean // Add this prop to disable up arrow on first item
  isLast?: boolean // Add this prop to disable down arrow on last item
}

// Function to extract hypothesis theme (first part before "because" or similar)
const extractHypothesisTheme = (text: string): { theme: string; detail: string } => {
  const causalWords = ["because", "due to", "as a result of"]
  let theme = text
  let detail = ""

  for (const word of causalWords) {
    if (text.toLowerCase().includes(word)) {
      const parts = text.split(new RegExp(`(${word})`, "i"))
      if (parts.length >= 3) {
        theme = parts[0].trim()
        detail = parts.slice(1).join("").trim()
        break
      }
    }
  }

  return { theme, detail }
}

// Update the function parameters to include the new props
export default function QuestionCard({
  question,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  showSettings,
  onToggleSettings,
  hypotheses = [], // Default to empty array if not provided
  onLinkHypothesis = () => {}, // Default to no-op function if not provided
  hypothesisColors = {}, // Default to empty object if not provided
  surveyContext = { problemStatement: "", successCriteria: "", targetUsers: "" },
  isDragging = false,
  onDragStart,
  onDragEnd,
  onMoveUp = () => {}, // Default to no-op function if not provided
  onMoveDown = () => {}, // Default to no-op function if not provided
  isFirst = false,
  isLast = false,
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)
  // Replace these lines
  // const [secondaryHypothesisIds, setSecondaryHypothesisIds] = useState<string[]>(question.secondaryHypothesisIds || [])

  // With these lines
  const [hypothesisIds, setHypothesisIds] = useState<string[]>(question.hypothesisIds || [])

  // Add state for AI suggestion loading and modal
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showAISuggestionModal, setShowAISuggestionModal] = useState(false)

  // Add state for expanded hypotheses
  const [expandedHypotheses, setExpandedHypotheses] = useState<Record<string, boolean>>(() => {
    // Initialize with all hypotheses expanded
    const expanded: Record<string, boolean> = {}
    question.hypothesisIds?.forEach((id) => {
      expanded[id] = true
    })
    return expanded
  })

  // Add state for expanded hypothesis descriptions in the selector
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

  // Focus the title input when the card is selected and isEditing is true
  useEffect(() => {
    if (isSelected && isEditing && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isSelected, isEditing])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // When hypothesisIds change, make sure all are expanded
    const newExpanded = { ...expandedHypotheses }
    hypothesisIds.forEach((id) => {
      if (newExpanded[id] === undefined) {
        newExpanded[id] = true
      }
    })
    setExpandedHypotheses(newExpanded)
  }, [hypothesisIds])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...question,
      title: e.target.value,
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      description: e.target.value,
    })
  }

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({
      ...question,
      required: checked,
    })
  }

  const handleAIFollowUpChange = (checked: boolean) => {
    onUpdate({
      ...question,
      aiFollowUp: {
        ...question.aiFollowUp,
        enabled: checked,
      },
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only select the card if we're not clicking on an input, button, or other interactive element
    if (
      e.target instanceof Node &&
      !titleInputRef.current?.contains(e.target) &&
      !descriptionTextareaRef.current?.contains(e.target)
    ) {
      onSelect()
    }
  }

  const handleSettingsToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isSelected) {
      onSelect() // Select the question if it's not already selected
    }
    onToggleSettings() // Then toggle settings
  }

  // Toggle hypothesis expansion
  const toggleHypothesisExpansion = (hypothesisId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedHypotheses((prev) => ({
      ...prev,
      [hypothesisId]: !prev[hypothesisId],
    }))
  }

  // Replace these lines
  // // Handle primary hypothesis linking
  // const handleHypothesisChange = (hypothesisId: string) => {
  //   onLinkHypothesis(question.id, hypothesisId)
  // }

  // // Handle removing primary hypothesis
  // const handleRemovePrimaryHypothesis = (e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   onUpdate({
  //     ...question,
  //     hypothesisId: undefined,
  //   })
  // }

  // // Handle secondary hypothesis linking
  // const handleSecondaryHypothesisChange = (hypothesisId: string, checked: boolean) => {
  //   let newSecondaryHypothesisIds: string[]

  //   if (checked) {
  //     // Add to secondary hypotheses if not already there and not the primary hypothesis
  //     if (!secondaryHypothesisIds.includes(hypothesisId) && hypothesisId !== question.hypothesisId) {
  //       newSecondaryHypothesisIds = [...secondaryHypothesisIds, hypothesisId]
  //     } else {
  //       newSecondaryHypothesisIds = [...secondaryHypothesisIds]
  //     }
  //   } else {
  //     // Remove from secondary hypotheses
  //     newSecondaryHypothesisIds = secondaryHypothesisIds.filter((id) => id !== hypothesisId)
  //   }

  //   setSecondaryHypothesisIds(newSecondaryHypothesisIds)

  //   // Update the question with new secondary hypotheses
  //   onUpdate({
  //     ...question,
  //     secondaryHypothesisIds: newSecondaryHypothesisIds,
  //   })
  // }

  // With these lines
  // Handle hypothesis linking
  const handleHypothesisChange = (hypothesisId: string, checked: boolean) => {
    let newHypothesisIds: string[]

    if (checked) {
      // Add to hypotheses if not already there
      if (!hypothesisIds.includes(hypothesisId)) {
        newHypothesisIds = [...hypothesisIds, hypothesisId]
      } else {
        newHypothesisIds = [...hypothesisIds]
      }
    } else {
      // Remove from hypotheses
      newHypothesisIds = hypothesisIds.filter((id) => id !== hypothesisId)
    }

    setHypothesisIds(newHypothesisIds)

    // Update the question with new hypotheses
    onUpdate({
      ...question,
      hypothesisIds: newHypothesisIds,
    })
  }

  // Handle removing a hypothesis
  const handleRemoveHypothesis = (e: React.MouseEvent, hypothesisId: string) => {
    e.stopPropagation()
    const newHypothesisIds = hypothesisIds.filter((id) => id !== hypothesisId)
    setHypothesisIds(newHypothesisIds)
    onUpdate({
      ...question,
      hypothesisIds: newHypothesisIds.length > 0 ? newHypothesisIds : undefined,
    })

    // Also remove from expanded state
    const newExpandedHypotheses = { ...expandedHypotheses }
    delete newExpandedHypotheses[hypothesisId]
    setExpandedHypotheses(newExpandedHypotheses)
  }

  // Add generateAISuggestion function inside the QuestionCard component
  const generateAISuggestion = () => {
    setIsLoadingAI(true)

    // Open the AI suggestion modal
    setTimeout(() => {
      setIsLoadingAI(false)
      setShowAISuggestionModal(true)
    }, 500)
  }

  // Handle accepting an AI suggestion
  const handleAcceptSuggestion = (updatedQuestion: Question, hypothesisId: string) => {
    // Update the question with the suggestion
    onUpdate(updatedQuestion)

    // Update the local state to reflect the changes
    setHypothesisIds(updatedQuestion.hypothesisIds || [])
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const handleDragStart = (event: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(event)
    }
  }

  const handleDragEnd = (event: React.DragEvent) => {
    if (onDragEnd) {
      onDragEnd(event)
    }
  }

  const linkedHypotheses = hypotheses.filter((hypothesis) => question.hypothesisIds?.includes(hypothesis.id))

  // State for expanded text within the hypothesis badges
  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({})

  // Function to toggle the expanded state of the text
  const toggleExpandedText = (hypothesisId: string) => {
    setExpandedText((prev) => ({
      ...prev,
      [hypothesisId]: !prev[hypothesisId],
    }))
  }

  // State for expanded/collapsed state of hypothesis text
  const [hypothesisTextExpanded, setHypothesisTextExpanded] = useState<Record<string, boolean>>({})

  const toggleHypothesisTextExpansion = (hypothesisId: string) => {
    setHypothesisTextExpanded((prev) => ({
      ...prev,
      [hypothesisId]: !prev[hypothesisId],
    }))
  }

  // Function to determine if the screen is mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust the breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div
        className={cn(
          "transition-all border rounded-lg overflow-hidden",
          isSelected ? "border-blue-400 shadow-md" : "hover:border-gray-300",
          isDragging ? "opacity-50 border-blue-400 shadow-lg" : "",
        )}
      >
        <motion.div
          id={`question-${question.id}`}
          className={cn("bg-white group", showSettings ? "rounded-b-none" : "")}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isDragging ? 0.5 : 1,
            y: 0,
            scale: isDragging ? 1.02 : 1,
            boxShadow: isDragging ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none",
          }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.005 }}
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          layout
        >
          <CardContent className="p-4 sm:p-4" onClick={handleCardClick}>
            <div className="flex items-start gap-2">
              {/* Drag handle */}
              <div className="flex flex-col mt-1 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveUp()
                  }}
                  disabled={isFirst}
                >
                  <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveDown()
                  }}
                  disabled={isLast}
                >
                  <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                </Button>

                <div
                  className="mt-1 p-1.5 cursor-grab rounded-md hover:bg-gray-100 active:cursor-grabbing active:bg-gray-200 transition-colors group-hover:bg-gray-50"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Grip className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* With this */}
                {/* Hypotheses badges - updated with expand/collapse functionality */}
                {linkedHypotheses.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {linkedHypotheses.map((hypothesis, index) => {
                      const color = hypothesisColors[hypothesis.id] || {
                        bg: `bg-blue-50`,
                        text: `text-blue-700`,
                        border: `border-blue-200`,
                      }

                      const isExpanded = expandedHypotheses[hypothesis.id]
                      const { theme, detail } = extractHypothesisTheme(hypothesis.text)
                      // Find the index of this hypothesis in the full hypotheses array
                      const hypothesisIndex = hypotheses.findIndex((h) => h.id === hypothesis.id)
                      const hypothesisLabel = `H${hypothesisIndex + 1}: `

                      // Determine if the text is expanded or truncated
                      const isTextExpanded = expandedText[hypothesis.id] || false
                      const truncatedText = truncateText(hypothesis.text, isMobile ? 30 : 60)
                      const displayText = isTextExpanded ? hypothesis.text : truncatedText

                      return (
                        <Badge
                          key={hypothesis.id}
                          variant="outline"
                          className={`${color.bg} ${color.text} ${color.border} flex items-center gap-1 w-full cursor-pointer transition-all`}
                        >
                          <div
                            className="flex-1 flex items-center min-w-0"
                            onClick={(e) => toggleHypothesisExpansion(hypothesis.id, e)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 mr-1 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                            )}
                            <span className={`${isExpanded ? "break-words" : "truncate"} text-xs sm:text-sm`}>
                              <span className="font-bold">{hypothesisLabel}</span>
                              {isExpanded ? hypothesis.text : truncateText(theme, isMobile ? 20 : 35)}
                            </span>
                          </div>
                          <button
                            className="ml-1 hover:bg-blue-100 rounded-full p-0.5 flex-shrink-0"
                            onClick={(e) => handleRemoveHypothesis(e, hypothesis.id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {/* With this */}
                {/* Update the question title section to include the AI suggestion button */}
                <div className="flex items-center gap-2 mb-1 relative">
                  <Input
                    ref={titleInputRef}
                    value={question.title}
                    onChange={handleTitleChange}
                    onFocus={() => {
                      setIsEditing(true)
                      if (!isSelected) onSelect()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                      if (!isSelected) onSelect()
                    }}
                    className={cn(
                      "border-none px-0 py-0 h-auto text-sm sm:text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0 cursor-text",
                      !isEditing && "bg-transparent",
                      isEditing && "bg-blue-50/30",
                    )}
                    placeholder="Question title"
                  />

                  {question.required && <span className="text-red-500 text-sm">*</span>}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 h-6 w-6 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            generateAISuggestion()
                          }}
                          disabled={isLoadingAI}
                        >
                          {isLoadingAI ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Get AI Suggestion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Question description - Always show the textarea */}
                <div className="mt-1">
                  <Textarea
                    ref={descriptionTextareaRef}
                    value={question.description || ""}
                    onChange={handleDescriptionChange}
                    onFocus={() => {
                      setIsEditing(true)
                      if (!isSelected) onSelect()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                      if (!isSelected) onSelect()
                    }}
                    className={cn(
                      "border-none px-0 py-0 min-h-0 text-xs sm:text-sm text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none cursor-text",
                      isEditing ? "bg-blue-50/30" : "bg-transparent",
                    )}
                    placeholder="Add a subheadline to clarify your question (optional)"
                  />
                </div>

                {/* AI follow-up indicator */}
                {question.aiFollowUp.enabled && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-blue-600">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-xs">AI will generate follow-up questions based on responses</span>
                  </div>
                )}
              </div>

              {/* Question actions */}
              <div className="flex flex-col gap-1">
                {hypotheses && hypotheses.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500">
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] sm:w-[320px] p-3 sm:p-4" side={isMobile ? "bottom" : "left"}>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Select all hypotheses this question helps test</h4>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              Choose which hypotheses are relevant to this question
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                // If all are selected, deselect all. Otherwise, select all.
                                const allSelected = hypotheses.every((h) => hypothesisIds.includes(h.id))
                                if (allSelected) {
                                  setHypothesisIds([])
                                  onUpdate({
                                    ...question,
                                    hypothesisIds: [],
                                  })
                                } else {
                                  const allIds = hypotheses.map((h) => h.id)
                                  setHypothesisIds(allIds)
                                  onUpdate({
                                    ...question,
                                    hypothesisIds: allIds,
                                  })
                                }
                              }}
                            >
                              {hypotheses.every((h) => hypothesisIds.includes(h.id)) ? "Deselect All" : "Select All"}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                          {hypotheses.map((hypothesis, index) => {
                            const color = hypothesisColors[hypothesis.id] || {
                              bg: "bg-gray-50",
                              text: "text-gray-700",
                              border: "border-gray-200",
                            }

                            const isSelected = hypothesisIds.includes(hypothesis.id)
                            const { theme, detail } = extractHypothesisTheme(hypothesis.text)
                            const hypothesisLabel = `H${index + 1}: `

                            // State for expanded text
                            const isExpanded = expandedDescriptions[hypothesis.id] || false

                            return (
                              <div
                                key={hypothesis.id}
                                className={cn(
                                  "relative flex items-start p-2 rounded-md border transition-all cursor-pointer group",
                                  isSelected
                                    ? `${color.bg} ${color.border} border-l-4`
                                    : "border-gray-200 hover:bg-gray-50",
                                )}
                                onClick={() => handleHypothesisChange(hypothesis.id, !isSelected)}
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
                                    {isSelected && <Check className={`h-4 w-4 mr-2 ${color.text}`} />}
                                    <Label
                                      htmlFor={`hypothesis-${hypothesis.id}`}
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
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setExpandedDescriptions((prev) => ({
                                          ...prev,
                                          [hypothesis.id]: !prev[hypothesis.id],
                                        }))
                                      }}
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
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Settings button - Add back the edit button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", showSettings ? "text-blue-500" : "text-gray-500")}
                  onClick={handleSettingsToggle}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bottom controls - updated for better mobile display */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mt-4 pt-3 border-t gap-y-2">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`required-${question.id}`}
                    checked={question.required}
                    onCheckedChange={handleRequiredChange}
                  />
                  <Label htmlFor={`required-${question.id}`} className="text-xs sm:text-sm">
                    Required
                  </Label>
                </div>

                {/* AI Follow-up switch moved next to Required */}
                <div className="flex items-center gap-2">
                  <Switch
                    id={`ai-followup-${question.id}`}
                    checked={question.aiFollowUp.enabled}
                    onCheckedChange={handleAIFollowUpChange}
                  />
                  <Label htmlFor={`ai-followup-${question.id}`} className="text-xs sm:text-sm flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                    AI Follow-up
                  </Label>
                </div>
              </div>

              {/* Move delete button to bottom right */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </motion.div>

        {/* Settings component */}
        {isSelected && (
          <QuestionSettings
            question={question}
            onUpdateQuestion={onUpdate}
            isOpen={showSettings}
            onClose={handleSettingsToggle}
          />
        )}
      </div>

      {/* AI Suggestion Modal */}
      <AISuggestionModal
        isOpen={showAISuggestionModal}
        onClose={() => setShowAISuggestionModal(false)}
        onAccept={handleAcceptSuggestion}
        hypotheses={hypotheses}
        surveyContext={surveyContext}
        questionId={question.id}
      />
    </>
  )
}
