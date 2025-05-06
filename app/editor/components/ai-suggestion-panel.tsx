"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, X, Plus, Lightbulb } from "lucide-react"
import type { Question } from "../types/survey-types"

interface AISuggestionPanelProps {
  questions: Question[]
  onAddQuestion: (question: Question) => void
  onClose: () => void
}

export default function AISuggestionPanel({ questions, onAddQuestion, onClose }: AISuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading AI suggestions
    setIsLoading(true)
    const timer = setTimeout(() => {
      // Generate suggestions based on existing questions
      const newSuggestions = generateSuggestions(questions)
      setSuggestions(newSuggestions)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [questions])

  // This would be replaced with a real AI-powered suggestion engine
  const generateSuggestions = (existingQuestions: Question[]): Question[] => {
    const suggestionPool: Partial<Question>[] = [
      {
        type: "conversational_question",
        title: "What aspects of our product do you find most valuable in your day-to-day work?",
        description: "We'd love to understand how our product fits into your workflow",
        required: true,
        aiFollowUp: {
          enabled: true,
          probeDepth: "high",
          customDepth: 70,
        },
      },
      {
        type: "conversational_question",
        title: "If you could change one thing about our service, what would it be and why?",
        required: true,
        aiFollowUp: {
          enabled: true,
          probeDepth: "medium",
          customDepth: 40,
        },
      },
      {
        type: "conversational_question",
        title: "How has our product helped you solve your biggest challenges?",
        required: false,
        aiFollowUp: {
          enabled: true,
          probeDepth: "high",
          customDepth: 80,
        },
      },
    ]

    // Filter out suggestions that are too similar to existing questions
    const filteredSuggestions = suggestionPool.filter((suggestion) => {
      return !existingQuestions.some(
        (existing) =>
          existing.title.toLowerCase().includes(suggestion.title?.toLowerCase() || "") ||
          (suggestion.title?.toLowerCase() || "").includes(existing.title.toLowerCase()),
      )
    })

    // Add IDs to make them valid questions
    return filteredSuggestions.slice(0, 3).map((suggestion) => ({
      ...suggestion,
      id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    })) as Question[]
  }

  const handleAddQuestion = (suggestion: Question) => {
    // Create a new question with a unique ID to avoid any potential conflicts
    const newQuestion: Question = {
      ...suggestion,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    onAddQuestion(newQuestion)
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-blue-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">AI Suggested Questions</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="flex gap-1 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
            </div>
            <p className="text-sm text-gray-500">Analyzing your survey and generating suggestions...</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 border rounded-md hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group"
                  onClick={() => handleAddQuestion(suggestion)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{suggestion.title}</h3>
                      {suggestion.description && <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddQuestion(suggestion)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs text-gray-600">
                      AI will generate follow-up questions based on responses
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-gray-500">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No additional suggestions available right now.</p>
                <p className="text-sm mt-1">Try adding more questions to your survey first.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
