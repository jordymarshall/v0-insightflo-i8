"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SurveyRespondentView from "../components/survey-respondent-view"
import { ArrowLeft } from "lucide-react"

export default function SurveyPreviewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Function to handle exiting preview mode
  const handleExitPreview = () => {
    // In a real app, this would navigate to the survey editor or dashboard
    router.push("/")
  }

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Render a loading placeholder
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Exit Preview Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleExitPreview}
          className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Preview
        </button>
      </div>

      {/* Render the survey respondent view with preview mode enabled */}
      <SurveyRespondentView previewMode={true} />
    </div>
  )
}
