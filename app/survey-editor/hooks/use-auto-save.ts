"use client"

import { useState, useEffect } from "react"
import type { Question, SaveStatus } from "../types/survey-types"

export function useAutoSave(questions: Question[]) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    status: "saved",
    lastSaved: new Date(),
  })

  const [previousQuestions, setPreviousQuestions] = useState<string>("")

  useEffect(() => {
    // Convert questions to string for comparison
    const currentQuestionsString = JSON.stringify(questions)

    // Only trigger save if questions have changed
    if (previousQuestions && previousQuestions !== currentQuestionsString) {
      // Set status to saving
      setSaveStatus({
        status: "saving",
      })

      // Simulate API call with timeout
      const saveTimeout = setTimeout(() => {
        // Simulate successful save
        setSaveStatus({
          status: "saved",
          lastSaved: new Date(),
        })

        // In a real app, you would save to API here
        // Example:
        // saveToAPI(questions)
        //   .then(() => setSaveStatus({ status: 'saved', lastSaved: new Date() }))
        //   .catch(error => setSaveStatus({ status: 'error', error: error.message }))
      }, 1000)

      return () => clearTimeout(saveTimeout)
    }

    // Update previous questions for next comparison
    setPreviousQuestions(currentQuestionsString)
  }, [questions])

  return { saveStatus }
}
