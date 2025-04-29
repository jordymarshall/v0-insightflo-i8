"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Check, Sparkles, Lightbulb } from "lucide-react"
import type { Hypothesis } from "./hypotheses-band"
import type { Question } from "../types/survey-types"

interface AISuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (question: Question, hypothesisId: string) => void
  hypotheses: Hypothesis[]
  surveyContext: {
    problemStatement: string
    successCriteria: string
    targetUsers: string
  }
  questionId?: string
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

export default function AISuggestionModal({
  isOpen,
  onClose,
  onAccept,
  hypotheses,
  surveyContext,
  questionId,
}: AISuggestionModalProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [suggestedQuestion, setSuggestedQuestion] = useState<{
    title: string
    description: string
    explanation: string
    hypothesisId: string
  } | null>(null)

  // Generate a suggestion when the modal opens
  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true)
      generateSuggestion()
    }
  }, [isOpen])

  const generateSuggestion = () => {
    // Simulate API call with timeout
    setTimeout(() => {
      // Select a random hypothesis to associate with this question
      const selectedHypothesis = hypotheses[Math.floor(Math.random() * hypotheses.length)]

      // Generate question based on the hypothesis and survey context
      const questionSuggestions = [
        {
          title: "What specific challenges have you encountered when using our product?",
          description: "We're looking to understand pain points to prioritize our development roadmap.",
          explanation: `This question helps us test the hypothesis that "${selectedHypothesis.text}" by identifying specific user pain points.`,
        },
        {
          title: "How would you describe your experience with our customer support team?",
          description: "Your feedback helps us improve our training and support processes.",
          explanation: `This question addresses the hypothesis that "${selectedHypothesis.text}" by evaluating the effectiveness of our support team.`,
        },
        {
          title: "What features would you like to see improved in our product?",
          description: "Please be as specific as possible to help us understand your needs better.",
          explanation: `Based on the hypothesis that "${selectedHypothesis.text}", this question helps us identify which features need improvement.`,
        },
        {
          title: "What was your main goal when you first started using our product?",
          description: "We want to ensure our product aligns with your workflow and expectations.",
          explanation: `This question tests the hypothesis that "${selectedHypothesis.text}" by understanding initial user intentions.`,
        },
        {
          title: "How has our product helped you solve problems in your workflow?",
          description: "This helps us understand how our product fits into your daily activities.",
          explanation: `To test the hypothesis that "${selectedHypothesis.text}", this question explores how users integrate our product into their workflow.`,
        },
      ]

      // Select a random question
      const selectedQuestion = questionSuggestions[Math.floor(Math.random() * questionSuggestions.length)]

      // Set the suggested question
      setSuggestedQuestion({
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        explanation: selectedQuestion.explanation,
        hypothesisId: selectedHypothesis.id,
      })

      setIsGenerating(false)
    }, 1500)
  }

  const handleAccept = () => {
    if (suggestedQuestion) {
      onAccept(
        {
          id: questionId || Date.now().toString(),
          type: "conversational_question",
          title: suggestedQuestion.title,
          description: suggestedQuestion.description,
          required: false,
          hypothesisIds: [suggestedQuestion.hypothesisId],
          aiFollowUp: {
            enabled: true,
            probeDepth: "auto",
            customDepth: 50,
          },
        },
        suggestedQuestion.hypothesisId,
      )
    }
    onClose()
  }

  // Find the hypothesis object
  const linkedHypothesis = suggestedQuestion ? hypotheses.find((h) => h.id === suggestedQuestion.hypothesisId) : null
  const hypothesisIndex = linkedHypothesis ? hypotheses.indexOf(linkedHypothesis) : 0
  const color = getHypothesisColor(hypothesisIndex)

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
            <div className="p-4 border-b flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium text-blue-800">AI Question Suggestion</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-600 hover:bg-blue-100">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              {isGenerating ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="flex gap-1 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Analyzing survey context and hypotheses to generate a relevant question...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Survey Context Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Based on your survey context:</p>
                    <p className="line-clamp-2">Problem: {surveyContext.problemStatement || "Not defined yet"}</p>
                  </div>

                  {/* Suggested Question */}
                  <Card className="border-blue-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Suggested Question</h3>
                        {linkedHypothesis && (
                          <Badge
                            variant="outline"
                            className={`${color.bg} ${color.text} ${color.border} flex items-center gap-1 whitespace-normal text-left`}
                          >
                            <span>{linkedHypothesis.text}</span>
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">{suggestedQuestion?.title}</p>
                        {suggestedQuestion?.description && (
                          <p className="text-sm text-gray-600">{suggestedQuestion.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Explanation */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-amber-800 mb-1">Why this question?</h3>
                        <p className="text-sm text-amber-700">{suggestedQuestion?.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Reject
              </Button>
              <Button
                onClick={handleAccept}
                disabled={isGenerating || !suggestedQuestion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept Suggestion
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
