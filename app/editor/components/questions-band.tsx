"use client"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"
import ListView from "./list-view"

interface QuestionsBandProps {
  questions: Question[]
  selectedQuestionId: string | null
  onSelectQuestion: (id: string) => void
  onUpdateQuestion: (question: Question) => void
  onDeleteQuestion: (id: string) => void
  onReorderQuestions: (questions: Question[]) => void
  onAddQuestion: () => void
  onLinkHypothesis: (questionId: string, hypothesisId: string) => void
  hypotheses: Hypothesis[]
  onAddHypothesis: (hypothesis: Hypothesis) => void
  surveyContext?: {
    problemStatement: string
    successCriteria: string
    targetUsers: string
  }
}

export default function QuestionsSection({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
  onAddQuestion,
  onLinkHypothesis,
  hypotheses,
  onAddHypothesis,
  surveyContext = { problemStatement: "", successCriteria: "", targetUsers: "" },
}: QuestionsBandProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-50">
        <ListView
          questions={questions}
          selectedQuestionId={selectedQuestionId}
          onSelectQuestion={onSelectQuestion}
          onUpdateQuestion={onUpdateQuestion}
          onDeleteQuestion={onDeleteQuestion}
          onReorderQuestions={onReorderQuestions}
          onAddQuestion={onAddQuestion}
          hypotheses={hypotheses}
          onLinkHypothesis={onLinkHypothesis}
          onAddHypothesis={onAddHypothesis}
          surveyContext={surveyContext}
        />
      </div>
    </div>
  )
}
