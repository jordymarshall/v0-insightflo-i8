"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  HelpCircle,
  Sparkles,
  Target,
  CheckSquare,
  HelpingHand,
  Plus,
  X,
  Loader2,
  Lightbulb,
  MessageSquare,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SurveyContextPageProps {
  problemStatement: string
  onProblemStatementChange: (value: string) => void
  successCriteria: string
  onSuccessCriteriaChange: (value: string) => void
  targetUsers: string
  onTargetUsersChange: (value: string) => void
  hypotheses: string
  onHypothesesChange: (value: string) => void
  onBack: () => void
  onGenerateQuestions?: () => void
}

// Define types for multiple success criteria, target users, and hypotheses
type SuccessCriterion = {
  id: string
  text: string
}

type TargetUser = {
  id: string
  text: string
}

type Hypothesis = {
  id: string
  text: string
}

// Function to get hypothesis color based on index - matches colors used in other components
const getHypothesisColor = (index: number) => {
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

// Helper function to extract keywords from text
const extractKeywords = (text: string): string[] => {
  const commonProductTerms = [
    "product",
    "feature",
    "dashboard",
    "onboarding",
    "interface",
    "app",
    "platform",
    "service",
    "tool",
    "website",
    "mobile app",
    "user experience",
    "UX",
    "UI",
    "design",
    "workflow",
  ]

  const keywords: string[] = []

  for (const term of commonProductTerms) {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      keywords.push(term)
    }
  }

  return keywords
}

export default function SurveyContextPage({
  problemStatement,
  onProblemStatementChange,
  successCriteria: initialSuccessCriteria,
  onSuccessCriteriaChange,
  targetUsers: initialTargetUsers,
  onTargetUsersChange,
  hypotheses: initialHypotheses,
  onHypothesesChange,
  onBack,
  onGenerateQuestions,
}: SurveyContextPageProps) {
  // State for context input
  const [contextInput, setContextInput] = useState("")

  // State for AI suggestion loading
  const [isLoadingProblemAI, setIsLoadingProblemAI] = useState(false)
  const [isLoadingSuccessAI, setIsLoadingSuccessAI] = useState(false)
  const [isLoadingTargetAI, setIsLoadingTargetAI] = useState(false)
  const [isLoadingHypothesisAI, setIsLoadingHypothesisAI] = useState(false)
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false)

  // Convert single string to array of items for success criteria and target users
  const [successCriteriaItems, setSuccessCriteriaItems] = useState<SuccessCriterion[]>(() => {
    return initialSuccessCriteria
      ? initialSuccessCriteria.split(";").map((text, index) => ({
          id: (index + 1).toString(),
          text: text.trim(),
        }))
      : []
  })

  const [targetUserItems, setTargetUserItems] = useState<TargetUser[]>(() => {
    return initialTargetUsers
      ? initialTargetUsers.split(";").map((text, index) => ({
          id: (index + 1).toString(),
          text: text.trim(),
        }))
      : []
  })

  const [hypothesisItems, setHypothesisItems] = useState<Hypothesis[]>(() => {
    return initialHypotheses
      ? initialHypotheses.split(";").map((text, index) => ({
          id: (index + 1).toString(),
          text: text.trim(),
        }))
      : []
  })

  // Function to generate workflow from context
  const generateWorkflow = () => {
    if (!contextInput.trim()) return

    setIsGeneratingWorkflow(true)

    // In a real implementation, this would be an API call to an AI service
    // For demo purposes, we'll simulate intelligent parsing of the input
    setTimeout(() => {
      // Parse the context input to extract relevant information
      const lines = contextInput.split(/\n|\./).filter((line) => line.trim().length > 0)

      // Instead of extracting the problem statement, let's generate one based on the context
      // Extract keywords from the context input
      const keywords = extractKeywords(contextInput)
      const productTerm = keywords.length > 0 ? keywords[0] : "product"

      // Generate problem statement based on context
      const problemStatementOptions = [
        `We need to understand why users are abandoning our ${productTerm} at a higher rate than expected, and identify the key friction points in their experience.`,
        `Our team needs to identify why user engagement with our ${productTerm} has been declining, and what specific improvements would increase retention.`,
        `We're seeing confusion around how to use our ${productTerm} effectively, and need to understand the gaps in our current user experience.`,
        `Users are reporting difficulties accomplishing their goals with our ${productTerm}, and we need to identify the underlying usability issues.`,
        `We need to understand what aspects of our ${productTerm} are most valuable to users, and which features are underutilized or misunderstood.`,
        `Our ${productTerm} redesign is planned for next quarter, and we need to identify the most critical pain points to address in the update.`,
        `We're seeing a high support ticket volume related to our ${productTerm}, and need to understand the root causes of user confusion.`,
      ]

      // Select a random problem statement and update
      const randomIndex = Math.floor(Math.random() * problemStatementOptions.length)
      const extractedProblemStatement = problemStatementOptions[randomIndex]

      // Update problem statement
      console.log("Updating problem statement to:", extractedProblemStatement)
      onProblemStatementChange(extractedProblemStatement)

      // Generate exactly 3 success criteria based on context
      const successCriteriaOptions = [
        "Identify the top 3 user pain points in the current experience",
        "Determine which features would provide the most value to users",
        "Understand user mental models and expectations for the product",
        "Discover opportunities to improve user satisfaction and engagement",
        "Identify the most critical areas for product improvement",
        "Determine what information users need to make decisions",
        "Understand how users currently work around limitations",
        "Identify which features users are underutilizing and why",
      ]

      // Shuffle the array to get random items
      const shuffledCriteria = [...successCriteriaOptions].sort(() => 0.5 - Math.random())

      // Take exactly 3 items
      const newSuccessCriteria = shuffledCriteria.slice(0, 3).map((text, index) => ({
        id: (index + 1).toString(),
        text,
      }))

      // Update success criteria
      setSuccessCriteriaItems(newSuccessCriteria)
      onSuccessCriteriaChange(newSuccessCriteria.map((item) => item.text).join("; "))

      // Generate exactly 2 target users based on context
      const targetUserOptions = [
        "New users who signed up in the last 30 days",
        "Users at risk of churning based on decreased activity",
        "Power users who use the product daily",
        "Enterprise customers with teams of 5+ members",
        "Active users who have used the product in the last 14 days",
        "Users who have contacted support in the last 30 days",
        "Users who abandoned the product after initial onboarding",
      ]

      // Shuffle the array to get random items
      const shuffledUsers = [...targetUserOptions].sort(() => 0.5 - Math.random())

      // Take exactly 2 items
      const newTargetUsers = shuffledUsers.slice(0, 2).map((text, index) => ({
        id: (index + 1).toString(),
        text,
      }))

      // Update target users
      setTargetUserItems(newTargetUsers)
      onTargetUsersChange(newTargetUsers.map((item) => item.text).join("; "))

      // Generate exactly 2 hypotheses based on context
      const hypothesesOptions = [
        "Users are confused by the interface because the information architecture is not intuitive",
        "Users find it difficult to accomplish their goals because the workflow is not aligned with their mental models",
        "Performance issues are causing user frustration and abandonment",
        "Users are not engaging with our product because they don't understand its value proposition",
        "Users abandon our product because they don't see immediate value in using it",
        "The lack of contextual help is preventing users from understanding how to use advanced features",
        "Users are overwhelmed by too many options presented during the first-time experience",
      ]

      // Shuffle the array to get random items
      const shuffledHypotheses = [...hypothesesOptions].sort(() => 0.5 - Math.random())

      // Take exactly 2 items
      const newHypotheses = shuffledHypotheses.slice(0, 2).map((text, index) => ({
        id: (index + 1).toString(),
        text,
      }))

      // Update hypotheses
      setHypothesisItems(newHypotheses)
      onHypothesesChange(newHypotheses.map((item) => item.text).join("; "))

      setIsGeneratingWorkflow(false)

      // Call the onGenerateQuestions callback if provided, but don't navigate away
      if (onGenerateQuestions) {
        setTimeout(() => {
          onGenerateQuestions()
        }, 500) // Small delay to ensure state updates have propagated
      }
    }, 2000)
  }

  // Function to generate AI suggestions
  const generateProblemStatement = () => {
    setIsLoadingProblemAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "We need to understand why users are abandoning our onboarding process at a rate of 68%, which is significantly higher than industry standards.",
        "Our customer support team is receiving an increasing number of questions about feature discoverability, suggesting our UI may not be intuitive enough.",
        "We've observed a 23% drop in user engagement after our latest redesign, and need to identify which specific changes are causing friction.",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      onProblemStatementChange(randomSuggestion)
      setIsLoadingProblemAI(false)
    }, 1200)
  }

  // Update the generateSuccessCriterion function to modify existing item instead of adding new one
  const generateSuccessCriterion = (id: string) => {
    setIsLoadingSuccessAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "Identify the top 3 friction points in our onboarding flow",
        "Determine which features users find most valuable",
        "Understand user mental models for organizing their workspace",
        "Discover what information users need before making a purchase decision",
        "Identify opportunities to improve user confidence during first-time use",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

      // Update the existing criterion instead of adding a new one
      updateSuccessCriterion(id, randomSuggestion)

      // Update parent component
      const updatedItems = successCriteriaItems.map((item) =>
        item.id === id ? { ...item, text: randomSuggestion } : item,
      )
      onSuccessCriteriaChange(updatedItems.map((item) => item.text).join("; "))

      setIsLoadingSuccessAI(false)
    }, 1000)
  }

  // Update the generateTargetUser function to modify existing item instead of adding new one
  const generateTargetUser = (id: string) => {
    setIsLoadingTargetAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "New users who signed up in the last 14 days",
        "Power users who use the product daily",
        "Users who abandoned the product after initial onboarding",
        "Enterprise customers with teams of 10+ members",
        "Users who have contacted support in the last 30 days",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

      // Update the existing target user instead of adding a new one
      updateTargetUser(id, randomSuggestion)

      // Update parent component
      const updatedItems = targetUserItems.map((item) => (item.id === id ? { ...item, text: randomSuggestion } : item))
      onTargetUsersChange(updatedItems.map((item) => item.text).join("; "))

      setIsLoadingTargetAI(false)
    }, 1000)
  }

  // Generate hypothesis with AI
  const generateHypothesis = (id: string) => {
    setIsLoadingHypothesisAI(true)
    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions = [
        "Users abandon our onboarding because they don't understand the value proposition of our product",
        "Feature discoverability issues are caused by inconsistent UI patterns across the application",
        "The redesigned navigation menu is causing confusion because it breaks users' mental models",
        "Users are overwhelmed by too many options presented during the first-time experience",
        "The lack of contextual help is preventing users from understanding how to use advanced features",
      ]
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

      // Update the existing hypothesis
      updateHypothesis(id, randomSuggestion)

      // Update parent component
      const updatedItems = hypothesisItems.map((item) => (item.id === id ? { ...item, text: randomSuggestion } : item))
      onHypothesesChange(updatedItems.map((item) => item.text).join("; "))

      setIsLoadingHypothesisAI(false)
    }, 1000)
  }

  // Functions to add empty items
  const addSuccessCriterion = () => {
    const newItem = { id: Date.now().toString(), text: "" }
    setSuccessCriteriaItems((prev) => [...prev, newItem])
    onSuccessCriteriaChange([...successCriteriaItems, newItem].map((item) => item.text).join("; "))
  }

  const addTargetUser = () => {
    const newItem = { id: Date.now().toString(), text: "" }
    setTargetUserItems((prev) => [...prev, newItem])
    onTargetUsersChange([...targetUserItems, newItem].map((item) => item.text).join("; "))
  }

  const addHypothesis = () => {
    const newItem = { id: Date.now().toString(), text: "" }
    const updatedItems = [...hypothesisItems, newItem]
    setHypothesisItems(updatedItems)
    onHypothesesChange(updatedItems.map((item) => item.text).join("; "))
  }

  // Functions to update items
  const updateSuccessCriterion = (id: string, text: string) => {
    setSuccessCriteriaItems((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
    const updatedItems = successCriteriaItems.map((item) => (item.id === id ? { ...item, text } : item))
    onSuccessCriteriaChange(updatedItems.map((item) => item.text).join("; "))
  }

  const updateTargetUser = (id: string, text: string) => {
    setTargetUserItems((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
    const updatedItems = targetUserItems.map((item) => (item.id === id ? { ...item, text } : item))
    onTargetUsersChange(updatedItems.map((item) => item.text).join("; "))
  }

  const updateHypothesis = (id: string, text: string) => {
    const updatedItems = hypothesisItems.map((item) => (item.id === id ? { ...item, text } : item))
    setHypothesisItems(updatedItems)
    onHypothesesChange(updatedItems.map((item) => item.text).join("; "))
  }

  // Functions to remove items
  const removeSuccessCriterion = (id: string) => {
    setSuccessCriteriaItems((prev) => prev.filter((item) => item.id !== id))
    const updatedItems = successCriteriaItems.filter((item) => item.id !== id)
    onSuccessCriteriaChange(updatedItems.map((item) => item.text).join("; "))
  }

  const removeTargetUser = (id: string) => {
    setTargetUserItems((prev) => prev.filter((item) => item.id !== id))
    const updatedItems = targetUserItems.filter((item) => item.id !== id)
    onTargetUsersChange(updatedItems.map((item) => item.text).join("; "))
  }

  const removeHypothesis = (id: string) => {
    const updatedItems = hypothesisItems.filter((item) => item.id !== id)
    setHypothesisItems(updatedItems)
    onHypothesesChange(updatedItems.map((item) => item.text).join("; "))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 overflow-auto py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Context Input Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <label className="text-lg font-medium text-gray-700">Share Your Context</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Describe your research goals and what you're trying to learn.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm text-gray-500">{contextInput ? `${contextInput.length}/500` : "0/500"}</span>
            </div>
            <div className="relative">
              <div
                className="rounded-lg border shadow-sm overflow-hidden bg-white relative"
                style={{
                  boxShadow: "0 0 30px rgba(149, 76, 233, 0.15)",
                }}
              >
                <Textarea
                  placeholder="Describe your research goals, target audience, and what you're trying to learn..."
                  className="min-h-[150px] resize-none border-0 focus-visible:ring-0 p-4"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value.slice(0, 500))}
                />
              </div>
              <div className="flex justify-center mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className={`border-3 border-purple-600 bg-white px-8 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer relative overflow-hidden group ${
                          !contextInput.trim() ? "opacity-70" : "hover:bg-purple-50"
                        }`}
                        style={{
                          borderRadius: "0.5rem",
                          borderWidth: "2px",
                          "--tw-text-opacity": "1 !important",
                          fontWeight: 500, // Match the medium font weight
                        }}
                        onClick={() => {
                          if (contextInput.trim()) {
                            generateWorkflow()
                          }
                        }}
                        disabled={isGeneratingWorkflow}
                      >
                        <span className="opacity-100 font-medium relative z-10 text-black">
                          {isGeneratingWorkflow ? (
                            <div className="flex items-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Generating...</span>
                            </div>
                          ) : (
                            <>
                              Generate Workflow{" "}
                              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Share your context above to generate a workflow.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpingHand className="h-5 w-5 text-blue-500" />
                <label htmlFor="problem-statement" className="text-lg font-medium text-gray-700">
                  Problem Statement
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Define why you're talking to people. What problem are you trying to solve?
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm text-gray-500">
                {problemStatement ? `${problemStatement.length}/200` : "0/200"}
              </span>
            </div>
            <div className="relative">
              <Textarea
                id="problem-statement"
                placeholder="Why are we talking to people? (e.g., We need to understand why users are dropping off during onboarding)"
                value={problemStatement}
                onChange={(e) => onProblemStatementChange(e.target.value.slice(0, 200))}
                className="min-h-[120px] resize-none border-blue-200 focus-visible:ring-blue-400 pr-10 text-black"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-2 right-2 h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      onClick={generateProblemStatement}
                      disabled={isLoadingProblemAI}
                    >
                      {isLoadingProblemAI ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Get AI Suggestion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Success Criteria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                <label className="text-lg font-medium text-gray-700">Success Criteria</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">What specific outcomes will make this research successful?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-3">
              {successCriteriaItems.length === 0 ? (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                  <Button variant="ghost" className="text-sm text-gray-500 gap-2" onClick={addSuccessCriterion}>
                    <Plus className="h-4 w-4" />
                    Add success criterion
                  </Button>
                </div>
              ) : (
                successCriteriaItems.map((item, index) => (
                  <div key={item.id} className="relative flex items-center gap-3">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-green-100 rounded-full text-green-700 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-grow relative">
                      <Input
                        value={item.text}
                        onChange={(e) => updateSuccessCriterion(item.id, e.target.value)}
                        placeholder="e.g., Identify top 3 onboarding blockers"
                        className="border-green-200 focus-visible:ring-green-400 pr-10"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-0 right-0 bottom-0 h-full w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => generateSuccessCriterion(item.id)}
                              disabled={isLoadingSuccessAI}
                            >
                              {isLoadingSuccessAI &&
                              index === successCriteriaItems.findIndex((i) => i.id === item.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Get AI Suggestion</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => removeSuccessCriterion(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}

              {successCriteriaItems.length > 0 && (
                <div className="flex justify-center mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-green-200 text-green-700 hover:bg-green-50"
                          onClick={addSuccessCriterion}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add another criterion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>

          {/* Target Users */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <label className="text-lg font-medium text-gray-700">Target Users</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Who should you be talking to? Define your target audience.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-3">
              {targetUserItems.length === 0 ? (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                  <Button variant="ghost" className="text-sm text-gray-500 gap-2" onClick={addTargetUser}>
                    <Plus className="h-4 w-4" />
                    Add target user
                  </Button>
                </div>
              ) : (
                targetUserItems.map((item, index) => (
                  <div key={item.id} className="relative flex items-center gap-3">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-grow relative">
                      <Input
                        value={item.text}
                        onChange={(e) => updateTargetUser(item.id, e.target.value)}
                        placeholder="e.g., Target users: signed‑up <14 days"
                        className="border-purple-200 focus-visible:ring-purple-400 pr-10"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-0 right-0 bottom-0 h-full w-8 p-0 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                              onClick={() => generateTargetUser(item.id)}
                              disabled={isLoadingTargetAI}
                            >
                              {isLoadingTargetAI && index === targetUserItems.findIndex((i) => i.id === item.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Get AI Suggestion</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => removeTargetUser(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}

              {targetUserItems.length > 0 && (
                <div className="flex justify-center mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={addTargetUser}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add another target user</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>

          {/* Hypotheses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-gray-700" />
                <label className="text-lg font-medium text-gray-700">Hypotheses</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">What are your assumptions that you want to test with this research?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-3">
              {hypothesisItems.length === 0 ? (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                  <Button variant="ghost" className="text-sm text-gray-500 gap-2" onClick={addHypothesis}>
                    <Plus className="h-4 w-4" />
                    Add hypothesis
                  </Button>
                </div>
              ) : (
                hypothesisItems.map((item, index) => {
                  const color = getHypothesisColor(index)
                  return (
                    <div key={item.id} className="relative flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center ${color.bg} rounded-full ${color.text} text-sm font-medium`}
                      >
                        H{index + 1}
                      </div>
                      <div className="flex-grow relative">
                        <Input
                          value={item.text}
                          onChange={(e) => updateHypothesis(item.id, e.target.value)}
                          placeholder="e.g., Users abandon onboarding due to unclear value proposition"
                          className={`${color.border} focus-visible:ring-amber-400 pr-10`}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`absolute top-0 right-0 bottom-0 h-full w-8 p-0 ${color.text} hover:bg-amber-50`}
                                onClick={() => generateHypothesis(item.id)}
                                disabled={isLoadingHypothesisAI}
                              >
                                {isLoadingHypothesisAI &&
                                index === hypothesisItems.findIndex((i) => i.id === item.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Get AI Suggestion</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeHypothesis(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })
              )}

              {hypothesisItems.length > 0 && (
                <div className="flex justify-center mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-gray-200 text-gray-700 hover:bg-gray-50"
                          onClick={addHypothesis}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add another hypothesis</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  )
}
