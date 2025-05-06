"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Info, Pencil, Trash2, Filter, X, ChevronDown } from "lucide-react"
import QuestionCard from "./question-card"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"
import HypothesisCreator from "./hypothesis-creator"
import QuestionCreator from "./question-creator"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { QuestionLimitWarning } from "./question-limit-warning"
import { useIsMobile } from "../hooks/use-mobile"

interface ListViewProps {
  questions: Question[]
  selectedQuestionId: string | null
  onSelectQuestion: (id: string) => void
  onUpdateQuestion: (question: Question) => void
  onDeleteQuestion: (id: string) => void
  onReorderQuestions: (questions: Question[]) => void
  onAddQuestion: () => void
  hypotheses: Hypothesis[]
  onLinkHypothesis: (questionId: string, hypothesisId: string) => void
  onAddHypothesis: (hypothesis: Hypothesis) => void
  surveyContext?: {
    problemStatement: string
    successCriteria: string
    targetUsers: string
  }
}

// Function to generate a unique color for each hypothesis
const getHypothesisColor = (index: number): { bg: string; text: string; border: string } => {
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  ]
  return colors[index % colors.length]
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

// Function to truncate text to a specified length
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + "..."
}

export default function ListView({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
  onAddQuestion,
  hypotheses,
  onLinkHypothesis,
  onAddHypothesis,
  surveyContext = { problemStatement: "", successCriteria: "", targetUsers: "" },
}: ListViewProps) {
  const [questionWithSettingsOpen, setQuestionWithSettingsOpen] = useState<string | null>(null)
  const [isHypothesisCreatorOpen, setIsHypothesisCreatorOpen] = useState(false)
  const [isQuestionCreatorOpen, setIsQuestionCreatorOpen] = useState(false)
  const [showQuestionLimitWarning, setShowQuestionLimitWarning] = useState(false)
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)
  const [dragOverQuestionId, setDragOverQuestionId] = useState<string | null>(null)
  const [editingHypothesis, setEditingHypothesis] = useState<Hypothesis | null>(null)
  const [deletingHypothesisId, setDeletingHypothesisId] = useState<string | null>(null)
  const [activeHypothesisFilters, setActiveHypothesisFilters] = useState<string[]>([])
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: "before" | "after" } | null>(null)
  const dragCounter = useRef<Record<string, number>>({})
  const [hypothesesExpanded, setHypothesesExpanded] = useState(true)

  const isMobile = useIsMobile()

  // Filter questions based on active hypothesis filters
  const filteredQuestions = questions.filter((question) => {
    // If no filters are active, show all questions
    if (activeHypothesisFilters.length === 0) {
      return true
    }

    // Check if the question has any of the active hypothesis filters
    const questionHypotheses = question.hypothesisIds || []

    return activeHypothesisFilters.some((filterId) => questionHypotheses.includes(filterId))
  })

  const handleToggleSettings = (questionId: string) => {
    setQuestionWithSettingsOpen((prevId) => (prevId === questionId ? null : questionId))
  }

  const handleSaveQuestion = (question: Question) => {
    onReorderQuestions([...questions, question])
    onSelectQuestion(question.id)
  }

  // Handle toggling a hypothesis filter
  const handleToggleHypothesisFilter = (hypothesisId: string) => {
    setActiveHypothesisFilters((prev) =>
      prev.includes(hypothesisId) ? prev.filter((id) => id !== hypothesisId) : [...prev, hypothesisId],
    )
  }

  // Clear all hypothesis filters
  const clearHypothesisFilters = () => {
    setActiveHypothesisFilters([])
  }

  // Handle question drag start
  const handleQuestionDragStart = (e: React.DragEvent, id: string) => {
    setDraggedQuestionId(id)
    e.dataTransfer.setData("questionId", id)
    e.dataTransfer.effectAllowed = "move"

    // Create a ghost image
    const ghostElement = document.getElementById(`question-${id}`)
    if (ghostElement) {
      const rect = ghostElement.getBoundingClientRect()
      e.dataTransfer.setDragImage(ghostElement, rect.width / 2, 20)
    }
  }

  // Handle question drag over
  const handleQuestionDragOver = (e: React.DragEvent, id: string, index: number) => {
    e.preventDefault()

    // If dragging a question, set dropEffect to move
    if (draggedQuestionId && draggedQuestionId !== id) {
      e.dataTransfer.dropEffect = "move"

      const draggedIndex = questions.findIndex((q) => q.id === draggedQuestionId)
      if (draggedIndex === -1) return

      // Determine if we're hovering above or below the middle of the target
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const relativeY = e.clientY - rect.top
      const position = relativeY < rect.height / 2 ? "before" : "after"

      // Update the drop indicator
      setDropIndicator({ index, position })
    }
  }

  // Handle dropping a question on a question
  const handleQuestionDrop = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    const droppedQuestionId = e.dataTransfer.getData("questionId")

    // If dropping a question (reordering)
    if (droppedQuestionId && draggedQuestionId) {
      const draggedIndex = questions.findIndex((q) => q.id === draggedQuestionId)
      const dropIndex = questions.findIndex((q) => q.id === questionId)

      if (draggedIndex !== -1 && dropIndex !== -1) {
        // Create a new array with the reordered questions
        const newQuestions = [...questions]
        const [removed] = newQuestions.splice(draggedIndex, 1)

        // Determine where to insert the dragged question
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const relativeY = e.clientY - rect.top
        const insertIndex = relativeY < rect.height / 2 ? dropIndex : dropIndex + 1

        // Insert at the correct position
        newQuestions.splice(insertIndex, 0, removed)

        // Update the questions order
        onReorderQuestions(newQuestions)
      }
    }

    setDraggedQuestionId(null)
    setDropIndicator(null)
    setDragOverQuestionId(null)
    dragCounter.current = {}
  }

  const handleQuestionDragEnter = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    dragCounter.current[questionId] = (dragCounter.current[questionId] || 0) + 1
    setDragOverQuestionId(questionId)
  }

  const handleQuestionDragLeave = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    dragCounter.current[questionId] = (dragCounter.current[questionId] || 0) - 1
    if (dragCounter.current[questionId] <= 0) {
      setDragOverQuestionId((current) => (current === questionId ? null : current))
    }
  }

  const handleDragEnd = () => {
    setDraggedQuestionId(null)
    setDropIndicator(null)
    setDragOverQuestionId(null)
    dragCounter.current = {}
  }

  // Handle editing a hypothesis
  const handleEditHypothesis = (hypothesis: Hypothesis) => {
    setEditingHypothesis(hypothesis)
    setIsHypothesisCreatorOpen(true)
  }

  // Handle updating a hypothesis
  const handleUpdateHypothesis = (updatedHypothesis: Hypothesis) => {
    const updatedHypotheses = hypotheses.map((h) => (h.id === updatedHypothesis.id ? updatedHypothesis : h))

    // Update all questions that reference this hypothesis
    const updatedQuestions = questions.map((q) => {
      if (q.hypothesisId === updatedHypothesis.id || q.secondaryHypothesisIds?.includes(updatedHypothesis.id)) {
        return q
      }
      return q
    })

    // Update the hypotheses list
    onAddHypothesis(updatedHypothesis)

    // Clear editing state
    setEditingHypothesis(null)
  }

  // Handle deleting a hypothesis
  const handleDeleteHypothesis = (hypothesisId: string) => {
    setDeletingHypothesisId(hypothesisId)
  }

  // Confirm deletion of a hypothesis
  const confirmDeleteHypothesis = () => {
    if (!deletingHypothesisId) return

    // Remove the hypothesis from all questions
    const updatedQuestions = questions.map((q) => {
      if (q.hypothesisIds?.includes(deletingHypothesisId)) {
        // Remove the hypothesis from the list
        const newHypothesisIds = q.hypothesisIds.filter((id) => id !== deletingHypothesisId)
        return {
          ...q,
          hypothesisIds: newHypothesisIds.length > 0 ? newHypothesisIds : undefined,
        }
      }
      return q
    })

    // Update all questions
    onReorderQuestions(updatedQuestions)

    // Remove the hypothesis from active filters if it's there
    setActiveHypothesisFilters((prev) => prev.filter((id) => id !== deletingHypothesisId))

    // Clear deleting state
    setDeletingHypothesisId(null)
  }

  // Create a map of hypothesis colors for easy access
  const hypothesisColorMap = hypotheses.reduce(
    (acc, h, i) => {
      acc[h.id] = getHypothesisColor(i)
      return acc
    },
    {} as Record<string, { bg: string; text: string; border: string }>,
  )

  // Update the function to handle an array of hypothesisIds
  const handleLinkHypothesis = (questionId: string, hypothesisIds: string[]) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          hypothesisIds: hypothesisIds.length > 0 ? hypothesisIds : undefined,
        }
      }
      return q
    })

    onReorderQuestions(updatedQuestions)
  }

  // Handle adding a question with warning if needed
  const handleAddQuestionClick = () => {
    if (questions.length > 4) {
      setShowQuestionLimitWarning(true)
    } else {
      setIsQuestionCreatorOpen(true)
    }
  }

  // Handle proceeding with adding a question after warning
  const handleProceedWithAddQuestion = () => {
    setShowQuestionLimitWarning(false)
    setIsQuestionCreatorOpen(true)
  }

  // Add handlers for moving questions up and down
  // Add these handlers after the handleProceedWithAddQuestion function:

  const handleMoveQuestionUp = (index: number) => {
    if (index <= 0) return // Can't move up if it's the first item

    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index - 1]
    newQuestions[index - 1] = temp

    onReorderQuestions(newQuestions)
  }

  const handleMoveQuestionDown = (index: number) => {
    if (index >= questions.length - 1) return // Can't move down if it's the last item

    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index + 1]
    newQuestions[index + 1] = temp

    onReorderQuestions(newQuestions)
  }

  return (
    <div className="flex-1 overflow-auto p-3 sm:p-4 pb-24">
      {hypotheses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Card className="max-w-md p-4 sm:p-6 text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start by creating a hypothesis</h3>
            <p className="text-gray-600 mb-4">
              Hypotheses help structure your research questions and ensure you're testing specific assumptions.
            </p>
            <Button onClick={() => setIsHypothesisCreatorOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Create First Hypothesis
            </Button>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {/* Hypotheses Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-7 flex justify-center mr-3">
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${hypothesesExpanded ? "" : "-rotate-90"}`}
                    onClick={() => setHypothesesExpanded(!hypothesesExpanded)}
                  />
                </div>
                <h2
                  className="text-base sm:text-lg font-medium cursor-pointer"
                  onClick={() => setHypothesesExpanded(!hypothesesExpanded)}
                >
                  Hypotheses
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {activeHypothesisFilters.length > 0 && (
                  <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={clearHypothesisFilters}>
                    <X className="h-3 w-3" />
                    Clear Filters
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setEditingHypothesis(null)
                    setIsHypothesisCreatorOpen(true)
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Hypothesis
                </Button>
              </div>
            </div>
            {hypothesesExpanded && (
              <>
                <div className="space-y-2 sm:space-y-3">
                  {hypotheses.map((hypothesis, index) => {
                    const color = getHypothesisColor(index)
                    const { theme, detail } = extractHypothesisTheme(hypothesis.text)
                    const isActive = activeHypothesisFilters.includes(hypothesis.id)
                    const hypothesisLabel = `H${index + 1}: `

                    return (
                      <div
                        key={hypothesis.id}
                        id={`hypothesis-${hypothesis.id}`}
                        className={`${color.bg} ${color.border} rounded-lg p-3 sm:p-4 group relative cursor-pointer transition-all w-full ${
                          isActive
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : activeHypothesisFilters.length > 0
                              ? "opacity-60"
                              : ""
                        }`}
                        onClick={() => handleToggleHypothesisFilter(hypothesis.id)}
                      >
                        <div className={`${color.text} font-medium text-sm sm:text-base`}>
                          <span className="font-bold">{hypothesisLabel}</span>
                          {isMobile ? truncateText(theme, 60) : theme}
                        </div>
                        {detail && !isMobile && <div className={`${color.text} mt-2`}>{detail}</div>}

                        {/* Edit and Delete buttons */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditHypothesis(hypothesis)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-white/80 hover:bg-white hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteHypothesis(hypothesis.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Click a hypothesis to filter questions.</span>
                  {activeHypothesisFilters.length > 0 && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                      {activeHypothesisFilters.length} filter{activeHypothesisFilters.length !== 1 ? "s" : ""} active
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Questions Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-medium">
                Questions
                {filteredQuestions.length !== questions.length && (
                  <span className="ml-2 text-xs sm:text-sm text-gray-500">
                    (Showing {filteredQuestions.length} of {questions.length})
                  </span>
                )}
              </h2>
            </div>
            <div className="space-y-3">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className={`relative ${dragOverQuestionId === question.id ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
                  onDragOver={(e) => handleQuestionDragOver(e, question.id, index)}
                  onDragEnter={(e) => handleQuestionDragEnter(e, question.id)}
                  onDragLeave={(e) => handleQuestionDragLeave(e, question.id)}
                  onDrop={(e) => handleQuestionDrop(e, question.id)}
                >
                  {dropIndicator?.index === index && dropIndicator.position === "before" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full transform -translate-y-1 z-10" />
                  )}

                  {/* Question number - hide on mobile */}
                  <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-700 hidden sm:flex">
                    {index + 1}
                  </div>

                  {/* Mobile question number */}
                  <div className="absolute left-2 top-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium text-gray-700 sm:hidden z-10">
                    {index + 1}
                  </div>

                  <QuestionCard
                    question={question}
                    isSelected={question.id === selectedQuestionId}
                    onSelect={() => onSelectQuestion(question.id)}
                    onUpdate={onUpdateQuestion}
                    onDelete={() => onDeleteQuestion(question.id)}
                    onDragStart={(e) => handleQuestionDragStart(e, question.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    showSettings={questionWithSettingsOpen === question.id}
                    onToggleSettings={() => handleToggleSettings(question.id)}
                    hypotheses={hypotheses}
                    onLinkHypothesis={handleLinkHypothesis}
                    hypothesisColors={hypothesisColorMap}
                    surveyContext={surveyContext}
                    onMoveUp={() => handleMoveQuestionUp(index)}
                    onMoveDown={() => handleMoveQuestionDown(index)}
                    isFirst={index === 0}
                    isLast={index === filteredQuestions.length - 1}
                  />

                  {dropIndicator?.index === index && dropIndicator.position === "after" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full transform translate-y-1 z-10" />
                  )}
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="border border-dashed rounded-lg p-4 sm:p-8 text-center">
                  {questions.length === 0 ? (
                    <>
                      <p className="text-gray-500 mb-4">No questions yet. Add your first question to get started.</p>
                      <Button onClick={() => setIsQuestionCreatorOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Question
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">No questions match your current filters.</p>
                      <Button onClick={clearHypothesisFilters} variant="outline">
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            {filteredQuestions.length > 0 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button onClick={handleAddQuestionClick} variant="outline" size="sm" className="gap-1 border-dashed">
                  <Plus className="h-3.5 w-3.5" />
                  Add Conversational Question
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hypothesis Creator Modal */}
      <HypothesisCreator
        isOpen={isHypothesisCreatorOpen}
        onClose={() => {
          setIsHypothesisCreatorOpen(false)
          setEditingHypothesis(null)
        }}
        onSave={editingHypothesis ? handleUpdateHypothesis : onAddHypothesis}
        initialHypothesis={editingHypothesis || undefined}
      />

      {/* Question Creator Modal */}
      <QuestionCreator
        isOpen={isQuestionCreatorOpen}
        onClose={() => setIsQuestionCreatorOpen(false)}
        onSave={handleSaveQuestion}
        hypotheses={hypotheses}
      />

      {/* Delete Hypothesis Confirmation Dialog */}
      <AlertDialog open={!!deletingHypothesisId} onOpenChange={(open) => !open && setDeletingHypothesisId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hypothesis</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hypothesis? This will remove it from all questions that reference it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteHypothesis} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Question Limit Warning Dialog */}
      <QuestionLimitWarning
        open={showQuestionLimitWarning}
        onClose={() => setShowQuestionLimitWarning(false)}
        onProceed={handleProceedWithAddQuestion}
      />
    </div>
  )
}
