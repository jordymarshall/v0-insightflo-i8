"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Question } from "../types/survey-types"
import QuestionCard from "./question-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Lightbulb } from "lucide-react"
import AISuggestionPanel from "./ai-suggestion-panel"
import { useIsMobile } from "../hooks/use-mobile"
import type { Hypothesis } from "./hypotheses-band"

// Update the SurveyEditingAreaProps interface
interface SurveyEditingAreaProps {
  questions: Question[]
  selectedQuestionId: string | null
  onSelectQuestion: (id: string) => void
  onUpdateQuestion: (question: Question) => void
  onDeleteQuestion: (id: string) => void
  onReorderQuestions: (questions: Question[]) => void
  onAddQuestion: () => void
  hypotheses?: Hypothesis[] // Make this optional with a default value
  onLinkHypothesis?: (questionId: string, hypothesisId: string) => void
}

export default function SurveyEditingArea({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
  onAddQuestion,
  hypotheses = [], // Default to empty array if not provided
  onLinkHypothesis = () => {}, // Default no-op function if not provided
}: SurveyEditingAreaProps) {
  // Add state for tracking which question has settings open
  const [questionWithSettingsOpen, setQuestionWithSettingsOpen] = useState<string | null>(null)
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: "before" | "after" } | null>(null)
  const dragCounter = useRef(0)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastQuestionRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    // Find the index of the dragged question
    const index = questions.findIndex((q) => q.id === id)
    setDraggedIndex(index)
    setDraggedQuestionId(id)

    // Set the drag data
    e.dataTransfer.setData("text/plain", id)
    e.dataTransfer.effectAllowed = "move"

    // Create a ghost image
    const ghostElement = document.getElementById(`question-${id}`)
    if (ghostElement) {
      const rect = ghostElement.getBoundingClientRect()
      e.dataTransfer.setDragImage(ghostElement, rect.width / 2, 20)
    }

    // Add a class to the body to indicate dragging
    document.body.classList.add("dragging-question")
  }

  const handleAddAISuggestion = (question: Question) => {
    // Add the suggested question to the questions array
    const updatedQuestions = [...questions, question]
    onReorderQuestions(updatedQuestions)
    onSelectQuestion(question.id)
    setShowAISuggestions(false)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (draggedIndex === null) return

    // Get the bounding rectangle of the target
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

    // Determine if we're hovering above or below the middle of the target
    const relativeY = e.clientY - rect.top
    const position = relativeY < rect.height / 2 ? "before" : "after"

    // Update the drop indicator
    setDropIndicator({ index, position })

    // Only reorder if position has changed
    if ((position === "before" && draggedIndex !== index - 1) || (position === "after" && draggedIndex !== index + 1)) {
      // Create a new array with the reordered questions
      const newQuestions = [...questions]
      const [removed] = newQuestions.splice(draggedIndex, 1)

      // Calculate the new index
      let newIndex = index
      if (position === "after") {
        newIndex = index
      } else if (position === "before") {
        newIndex = Math.max(0, index)
      }

      // If dragging downwards, need to adjust the index
      if (draggedIndex < newIndex) {
        newIndex--
      }

      // Insert at the correct position
      newQuestions.splice(newIndex, 0, removed)

      // Update the questions order
      onReorderQuestions(newQuestions)

      // Update the dragged index
      setDraggedIndex(newIndex)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDraggingOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedQuestionId(null)
    setDraggedIndex(null)
    setDropIndicator(null)
    setIsDraggingOver(false)
    dragCounter.current = 0
    document.body.classList.remove("dragging-question")
  }

  const handleDragEnd = () => {
    setDraggedQuestionId(null)
    setDraggedIndex(null)
    setDropIndicator(null)
    setIsDraggingOver(false)
    dragCounter.current = 0
    document.body.classList.remove("dragging-question")
  }

  // Add a handler for toggling settings
  const handleToggleSettings = (questionId: string) => {
    setQuestionWithSettingsOpen((prevId) => (prevId === questionId ? null : questionId))
  }

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

  const isMobile = useIsMobile()

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("dragging-question")
    }
  }, [])

  // Scroll to the newly added question
  useEffect(() => {
    if (questions.length > 0 && lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [questions.length])

  // Update the return statement
  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50 ${isDraggingOver ? "bg-blue-50/30" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      data-tour="editing-area"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              ref={index === questions.length - 1 ? lastQuestionRef : undefined}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: draggedQuestionId === question.id ? 0.5 : 1,
                y: 0,
                scale: draggedQuestionId === question.id ? 1.02 : 1,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative"
              onDragOver={(e) => handleDragOver(e, index)}
            >
              {dropIndicator?.index === index && dropIndicator.position === "before" && (
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full transform -translate-y-1 z-10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <QuestionCard
                question={question}
                isSelected={question.id === selectedQuestionId}
                onSelect={() => onSelectQuestion(question.id)}
                onUpdate={onUpdateQuestion}
                onDelete={() => onDeleteQuestion(question.id)}
                onDragStart={(e) => handleDragStart(e, question.id)}
                onDragEnd={handleDragEnd}
                showSettings={questionWithSettingsOpen === question.id}
                onToggleSettings={() => handleToggleSettings(question.id)}
                hypotheses={hypotheses}
                onLinkHypothesis={onLinkHypothesis}
                isDragging={draggedQuestionId === question.id}
                onMoveUp={() => handleMoveQuestionUp(index)}
                onMoveDown={() => handleMoveQuestionDown(index)}
                isFirst={index === 0}
                isLast={index === questions.length - 1}
              />

              {dropIndicator?.index === index && dropIndicator.position === "after" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full transform translate-y-1 z-10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state with drop zone indicator */}
        {questions.length === 0 && !showAISuggestions && (
          <motion.div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center mt-4 sm:mt-8 transition-colors ${
              isDraggingOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div className="bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-1 sm:mb-2">
              Start Building Your Conversational Survey
            </h3>
            <p className="text-sm sm:text-base text-blue-600 mb-3 sm:mb-4">
              Add conversational questions and enable AI follow-ups to gather deeper insights
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-100 text-sm sm:text-base"
                onClick={onAddQuestion}
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Add Conversational Question
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base mt-1 sm:mt-0"
                onClick={() => setShowAISuggestions(true)}
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Get AI Suggestions
              </Button>
            </div>
          </motion.div>
        )}

        {questions.length > 0 && (
          <div className="flex flex-col items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full px-2 sm:px-0">
            <Button
              variant="outline"
              className="gap-1 border-dashed hover:border-blue-300 hover:bg-blue-50 transition-colors w-full sm:w-auto text-sm sm:text-base"
              onClick={onAddQuestion}
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="whitespace-normal sm:whitespace-nowrap">Add Conversational Question</span>
            </Button>

            <Button
              variant="ghost"
              className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full sm:w-auto text-sm sm:text-base"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Get AI Suggestions</span>
            </Button>
          </div>
        )}

        {showAISuggestions && (
          <div className="mt-6">
            <AISuggestionPanel
              questions={questions}
              onAddQuestion={handleAddAISuggestion}
              onClose={() => setShowAISuggestions(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
