"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle } from "lucide-react"
import QuestionCard from "./question-card"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"
import HypothesisCreator from "./hypothesis-creator"
import QuestionCreator from "./question-creator"

interface SurveyBoardViewProps {
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
}

export default function SurveyBoardView({
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
}: SurveyBoardViewProps) {
  const [questionWithSettingsOpen, setQuestionWithSettingsOpen] = useState<string | null>(null)
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)
  const dragCounter = useRef(0)
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null)

  // State for hypothesis creator
  const [isHypothesisCreatorOpen, setIsHypothesisCreatorOpen] = useState(false)

  // State for question creator
  const [isQuestionCreatorOpen, setIsQuestionCreatorOpen] = useState(false)
  const [questionCreatorHypothesisId, setQuestionCreatorHypothesisId] = useState<string | undefined>(undefined)

  // Group questions by hypothesis
  const questionsByHypothesis: Record<string, Question[]> = {
    unassigned: [],
  }

  // Initialize columns for each hypothesis
  hypotheses.forEach((hypothesis) => {
    questionsByHypothesis[hypothesis.id] = []
  })

  // Populate columns with questions
  questions.forEach((question) => {
    if (question.hypothesisId) {
      // If the hypothesis exists, add the question to its column
      if (questionsByHypothesis[question.hypothesisId]) {
        questionsByHypothesis[question.hypothesisId].push(question)
      } else {
        // If the hypothesis doesn't exist (maybe it was deleted), add to unassigned
        questionsByHypothesis.unassigned.push(question)
      }
    } else {
      // If no hypothesis is assigned, add to unassigned
      questionsByHypothesis.unassigned.push(question)
    }
  })

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedQuestionId(id)
    e.dataTransfer.setData("questionId", id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, hypothesisId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDraggingOver(hypothesisId)
  }

  const handleDragEnter = (e: React.DragEvent, hypothesisId: string) => {
    e.preventDefault()
    dragCounter.current += 1
    setIsDraggingOver(hypothesisId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDraggingOver(null)
    }
  }

  const handleDrop = (e: React.DragEvent, hypothesisId: string) => {
    e.preventDefault()
    const questionId = e.dataTransfer.getData("questionId")

    if (questionId && draggedQuestionId) {
      // Update the question's hypothesisId
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, hypothesisId: hypothesisId === "unassigned" ? undefined : hypothesisId } : q,
      )

      onReorderQuestions(updatedQuestions)
    }

    setDraggedQuestionId(null)
    setIsDraggingOver(null)
    dragCounter.current = 0
  }

  const handleToggleSettings = (questionId: string) => {
    setQuestionWithSettingsOpen((prevId) => (prevId === questionId ? null : questionId))
  }

  // Handle adding a question to a specific hypothesis
  const handleAddQuestionToHypothesis = (hypothesisId: string) => {
    setQuestionCreatorHypothesisId(hypothesisId === "unassigned" ? undefined : hypothesisId)
    setIsQuestionCreatorOpen(true)
  }

  const handleSaveQuestion = (question: Question) => {
    onReorderQuestions([...questions, question])
    onSelectQuestion(question.id)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex gap-4 h-full">
        {/* Unassigned Column */}
        <div className="flex-1 min-w-[300px] max-w-[400px] flex flex-col">
          <div
            className={`bg-gray-100 rounded-t-lg p-3 font-medium text-gray-700 border-b ${
              isDraggingOver === "unassigned" ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            Unassigned Questions
          </div>
          <div
            className="flex-1 bg-gray-50 rounded-b-lg p-2 overflow-y-auto"
            onDragOver={(e) => handleDragOver(e, "unassigned")}
            onDragEnter={(e) => handleDragEnter(e, "unassigned")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "unassigned")}
          >
            <div className="space-y-3">
              {questionsByHypothesis.unassigned.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  isSelected={question.id === selectedQuestionId}
                  onSelect={() => onSelectQuestion(question.id)}
                  onUpdate={onUpdateQuestion}
                  onDelete={() => onDeleteQuestion(question.id)}
                  onDragStart={(e) => handleDragStart(e, question.id)}
                  onDragOver={() => {}}
                  onDragEnter={() => {}}
                  onDragLeave={() => {}}
                  onDragEnd={() => {}}
                  showSettings={questionWithSettingsOpen === question.id}
                  onToggleSettings={() => handleToggleSettings(question.id)}
                  hypotheses={hypotheses}
                  onLinkHypothesis={onLinkHypothesis}
                />
              ))}

              {questionsByHypothesis.unassigned.length === 0 && (
                <div className="border border-dashed rounded-lg p-4 text-center bg-white">
                  <p className="text-sm text-gray-500">Drag questions here or add a new one</p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-dashed"
                onClick={() => handleAddQuestionToHypothesis("unassigned")}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Question
              </Button>
            </div>
          </div>
        </div>

        {/* Hypothesis Columns */}
        {hypotheses.map((hypothesis, index) => (
          <div key={hypothesis.id} className="flex-1 min-w-[300px] max-w-[400px] flex flex-col">
            <div
              className={`bg-blue-100 rounded-t-lg p-3 font-medium text-blue-800 border-b ${
                isDraggingOver === hypothesis.id ? "bg-blue-200 border-blue-300" : ""
              }`}
            >
              <span className="font-bold">H{index + 1}: </span>
              {hypothesis.text}
            </div>
            <div
              className="flex-1 bg-blue-50/30 rounded-b-lg p-2 overflow-y-auto"
              onDragOver={(e) => handleDragOver(e, hypothesis.id)}
              onDragEnter={(e) => handleDragEnter(e, hypothesis.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, hypothesis.id)}
            >
              <div className="space-y-3">
                {questionsByHypothesis[hypothesis.id]?.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isSelected={question.id === selectedQuestionId}
                    onSelect={() => onSelectQuestion(question.id)}
                    onUpdate={onUpdateQuestion}
                    onDelete={() => onDeleteQuestion(question.id)}
                    onDragStart={(e) => handleDragStart(e, question.id)}
                    onDragOver={() => {}}
                    onDragEnter={() => {}}
                    onDragLeave={() => {}}
                    onDragEnd={() => {}}
                    showSettings={questionWithSettingsOpen === question.id}
                    onToggleSettings={() => handleToggleSettings(question.id)}
                    hypotheses={hypotheses}
                    onLinkHypothesis={onLinkHypothesis}
                  />
                ))}

                {(!questionsByHypothesis[hypothesis.id] || questionsByHypothesis[hypothesis.id].length === 0) && (
                  <div className="border border-dashed rounded-lg p-4 text-center bg-white">
                    <p className="text-sm text-gray-500">Drag questions here or add a new one</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-dashed"
                  onClick={() => handleAddQuestionToHypothesis(hypothesis.id)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Hypothesis Column */}
        <div className="flex-1 min-w-[300px] max-w-[400px] flex flex-col">
          <div className="bg-gray-100 rounded-lg p-3 h-full flex flex-col items-center justify-center text-center border border-dashed">
            <div className="p-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Add New Hypothesis</h3>
              <p className="text-gray-600 mb-4">Create a new hypothesis to test with your questions</p>
              <Button onClick={() => setIsHypothesisCreatorOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Hypothesis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hypothesis Creator Modal */}
      <HypothesisCreator
        isOpen={isHypothesisCreatorOpen}
        onClose={() => setIsHypothesisCreatorOpen(false)}
        onSave={onAddHypothesis}
      />

      {/* Question Creator Modal */}
      <QuestionCreator
        isOpen={isQuestionCreatorOpen}
        onClose={() => setIsQuestionCreatorOpen(false)}
        onSave={handleSaveQuestion}
        hypotheses={hypotheses}
        hypothesisId={questionCreatorHypothesisId}
      />
    </div>
  )
}
