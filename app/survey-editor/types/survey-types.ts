export type QuestionType = "conversational_question"

export type ProbeDepthPreset = "auto" | "high" | "medium" | "low" | "custom"

export interface AIFollowUp {
  enabled: boolean
  probeDepth: ProbeDepthPreset
  customDepth?: number
}

export interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  aiFollowUp: AIFollowUp
  hypothesisIds?: string[] // Replace hypothesisId and secondaryHypothesisIds with a single array
}

export interface SaveStatus {
  status: "saving" | "saved" | "error"
  lastSaved?: Date
  error?: string
}

export interface GlobalSettings {
  insightShare: boolean
  smartInsights: boolean
  adaptiveFollowups: boolean
}
