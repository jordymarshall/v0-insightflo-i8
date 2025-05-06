"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Info } from "lucide-react"
import QuestionCard from "./question-card"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"
import HypothesisCreator from "./hypothesis-creator"
import QuestionCreator from "./question-creator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"

interface MatrixViewProps {
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

export default function MatrixView({
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
}: MatrixViewProps) {
  const [questionWithSettingsOpen, setQuestionWithSettingsOpen] = useState<string | null>(null)
  const [isHypothesisCreatorOpen, setIsHypothesisCreatorOpen] = useState(false)
  const [isQuestionCreatorOpen, setIsQuestionCreatorOpen] = useState(false)
  const [questionCreatorHypothesisId, setQuestionCreatorHypothesisId] = useState<string | undefined>(undefined)
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null)

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
    setIsDraggingOver(hypothesisId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(null)
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
  }

  const handleToggleSettings = (questionId: string) => {
    setQuestionWithSettingsOpen((prevId) => (prevId === questionId ? null : questionId))
  }

  const handleAddQuestionToHypothesis = (hypothesisId: string) => {
    setQuestionCreatorHypothesisId(hypothesisId === "unassigned" ? undefined : hypothesisId)
    setIsQuestionCreatorOpen(true)
  }

  const handleSaveQuestion = (question: Question) => {
    onReorderQuestions([...questions, question])
    onSelectQuestion(question.id)
  }

  const handleEnter = (e: React.DragEvent, hypothesisId: string) => {
    e.preventDefault()
    setIsDraggingOver(hypothesisId)
  }

  const handleLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(null)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {hypotheses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Card className="max-w-md p-6 text-center">
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
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {/* Column Headers */}
          <div className="col-span-2 grid grid-cols-[auto_repeat(auto-fill,minmax(280px,1fr))] gap-4">
            <div className="w-48 flex-shrink-0"></div>
            {hypotheses.map((hypothesis, index) => (
              <div
                key={hypothesis.id}
                className="bg-blue-100 rounded-t-lg p-3 font-medium text-blue-800 border-b min-w-[280px]"
              >
                <div className="line-clamp-2">
                  <span className="font-bold">H{index + 1}: </span>
                  {hypothesis.text}
                </div>
              </div>
            ))}
            <div className="bg-gray-100 rounded-t-lg p-3 font-medium text-gray-700 border-b min-w-[280px]">
              <Button
                onClick={() => setIsHypothesisCreatorOpen(true)}
                variant="ghost"
                className="w-full justify-start p-0 h-auto font-medium text-gray-700 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Hypothesis
              </Button>
            </div>
          </div>

          {/* Unassigned Questions Row */}
          <div className="bg-gray-100 rounded-lg p-3 font-medium text-gray-700 w-48 flex-shrink-0 self-start">
            Unassigned Questions
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            <div
              className="bg-gray-50 rounded-lg p-2 min-h-[100px] min-w-[280px]"
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
            {/* Empty cells for alignment */}
            {hypotheses.map((h) => (
              <div key={`empty-${h.id}`} className="min-w-[280px]"></div>
            ))}
            <div className="min-w-[280px]"></div>
          </div>

          {/* Hypothesis Rows */}
          {hypotheses.map((hypothesis, index) => (
            <React.Fragment key={hypothesis.id}>
              <div className="bg-blue-100 rounded-lg p-3 font-medium text-blue-800 w-48 flex-shrink-0 self-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-left w-full truncate">
                      <span className="font-bold">H{index + 1}: </span>
                      {hypothesis.text}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        <span className="font-bold">H{index + 1}: </span>
                        {hypothesis.text}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                <div
                  className="bg-blue-50/30 rounded-lg p-2 min-h-[100px] min-w-[280px]"
                  onDragOver={(e) => handleDragOver(e, hypothesis.id)}
                  onDragEnter={(e) => handleEnter(e, hypothesis.id)}
                  onDragLeave={handleLeave}
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
                {/* Empty cells for alignment */}
                {hypotheses
                  .filter((h) => h.id !== hypothesis.id)
                  .map((h) => (
                    <div key={`empty-${hypothesis.id}-${h.id}`} className="min-w-[280px]"></div>
                  ))}
                <div className="min-w-[280px]"></div>
              </div>
            </React.Fragment>
          ))}

          {/* Add Hypothesis Row */}
          <div className="bg-gray-100 rounded-lg p-3 font-medium text-gray-700 w-48 flex-shrink-0 self-start">
            <Button
              onClick={() => setIsHypothesisCreatorOpen(true)}
              variant="ghost"
              className="w-full justify-start p-0 h-auto font-medium text-gray-700 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Hypothesis
            </Button>
          </div>
          <div></div>
        </div>
      )}

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
