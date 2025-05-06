"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Target,
  CheckSquare,
  HelpingHand,
  Plus,
  X,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SurveyContextBandProps {
  isExpanded: boolean
  onToggleExpand: () => void
  problemStatement: string
  onProblemStatementChange: (value: string) => void
  successCriteria: string
  onSuccessCriteriaChange: (value: string) => void
  targetUsers: string
  onTargetUsersChange: (value: string) => void
}

// Define types for multiple success criteria and target users
type SuccessCriterion = {
  id: string
  text: string
}

type TargetUser = {
  id: string
  text: string
}

export default function SurveyContextBand({
  isExpanded,
  onToggleExpand,
  problemStatement,
  onProblemStatementChange,
  successCriteria: initialSuccessCriteria,
  onSuccessCriteriaChange,
  targetUsers: initialTargetUsers,
  onTargetUsersChange,
}: SurveyContextBandProps) {
  // Auto-collapse after first view
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  // State for AI suggestion loading
  const [isLoadingProblemAI, setIsLoadingProblemAI] = useState(false)
  const [isLoadingSuccessAI, setIsLoadingSuccessAI] = useState(false)
  const [isLoadingTargetAI, setIsLoadingTargetAI] = useState(false)

  // Convert single string to array of items for success criteria and target users
  const [successCriteriaItems, setSuccessCriteriaItems] = useState<SuccessCriterion[]>(() => {
    return initialSuccessCriteria ? [{ id: "1", text: initialSuccessCriteria }] : []
  })

  const [targetUserItems, setTargetUserItems] = useState<TargetUser[]>(() => {
    return initialTargetUsers ? [{ id: "1", text: initialTargetUsers }] : []
  })

  // Update parent component when items change
  useEffect(() => {
    const combinedSuccessCriteria = successCriteriaItems.map((item) => item.text).join("; ")
    onSuccessCriteriaChange(combinedSuccessCriteria)
  }, [successCriteriaItems, onSuccessCriteriaChange])

  useEffect(() => {
    const combinedTargetUsers = targetUserItems.map((item) => item.text).join("; ")
    onTargetUsersChange(combinedTargetUsers)
  }, [targetUserItems, onTargetUsersChange])

  useEffect(() => {
    if (isExpanded && !hasBeenViewed) {
      setHasBeenViewed(true)
      // Auto-collapse after 10 seconds if it's the first view
      const timer = setTimeout(() => {
        onToggleExpand()
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, hasBeenViewed, onToggleExpand])

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

      setIsLoadingTargetAI(false)
    }, 1000)
  }

  // Functions to add empty items
  const addSuccessCriterion = () => {
    setSuccessCriteriaItems((prev) => [...prev, { id: Date.now().toString(), text: "" }])
  }

  const addTargetUser = () => {
    setTargetUserItems((prev) => [...prev, { id: Date.now().toString(), text: "" }])
  }

  // Functions to update items
  const updateSuccessCriterion = (id: string, text: string) => {
    setSuccessCriteriaItems((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const updateTargetUser = (id: string, text: string) => {
    setTargetUserItems((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  // Functions to remove items
  const removeSuccessCriterion = (id: string) => {
    setSuccessCriteriaItems((prev) => prev.filter((item) => item.id !== id))
  }

  const removeTargetUser = (id: string) => {
    setTargetUserItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div
      className={cn(
        "border-b bg-white transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "pb-4" : "",
      )}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={onToggleExpand}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-800">Survey Context</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {problemStatement ? "Context defined" : "Define your research context"}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 space-y-4"
          >
            {/* Problem Statement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpingHand className="h-4 w-4 text-blue-500" />
                  <label htmlFor="problem-statement" className="block text-sm font-medium text-gray-700">
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
                <span className="text-xs text-gray-500">
                  {problemStatement ? `${problemStatement.length}/200` : "0/200"}
                </span>
              </div>
              <div className="relative">
                <Textarea
                  id="problem-statement"
                  placeholder="Why are we talking to people? (e.g., We need to understand why users are dropping off during onboarding)"
                  value={problemStatement}
                  onChange={(e) => onProblemStatementChange(e.target.value.slice(0, 200))}
                  className="min-h-[80px] resize-none border-blue-200 focus-visible:ring-blue-400 pr-10"
                />
                {!problemStatement && (
                  <div className="absolute top-2 right-2 bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full border border-amber-200">
                    Required
                  </div>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-2 right-2 h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <label className="block text-sm font-medium text-gray-700">Success Criteria</label>
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

              <div className="space-y-2">
                {successCriteriaItems.length === 0 ? (
                  <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                    <Button variant="ghost" className="text-sm text-gray-500 gap-2" onClick={addSuccessCriterion}>
                      <Plus className="h-4 w-4" />
                      Add success criterion
                    </Button>
                  </div>
                ) : (
                  successCriteriaItems.map((item, index) => (
                    <div key={item.id} className="relative flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 rounded-full text-green-700 text-xs font-medium">
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
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeSuccessCriterion(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                {successCriteriaItems.length > 0 && (
                  <div className="flex justify-center mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-green-200 text-green-700 hover:bg-green-50"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <label className="block text-sm font-medium text-gray-700">Target Users</label>
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

              <div className="space-y-2">
                {targetUserItems.length === 0 ? (
                  <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                    <Button variant="ghost" className="text-sm text-gray-500 gap-2" onClick={addTargetUser}>
                      <Plus className="h-4 w-4" />
                      Add target user
                    </Button>
                  </div>
                ) : (
                  targetUserItems.map((item, index) => (
                    <div key={item.id} className="relative flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 text-xs font-medium">
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
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeTargetUser(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                {targetUserItems.length > 0 && (
                  <div className="flex justify-center mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-purple-200 text-purple-700 hover:bg-purple-50"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
