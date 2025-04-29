"use client"

import { useState } from "react"
import SurveyEditorHeader from "./components/survey-editor-header"
import type { Question } from "./types/survey-types"
import { useAutoSave } from "./hooks/use-auto-save"
import { useIsMobile } from "./hooks/use-mobile"
import SurveyContextPage from "./components/survey-context-page"
import QuestionsSection from "./components/questions-band"
import InsightsPage from "./components/insights-page"
import type { Hypothesis } from "./components/hypotheses-band"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, MessageSquare, BarChart3, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContentWrapper } from "./components/content-wrapper"

// Sample respondent data for the insights page
const sampleRespondents = [
  {
    id: "resp1",
    name: "Alex Johnson",
    responses: [
      {
        questionId: "1",
        answer:
          "I would love to see improvements in the dashboard analytics. The current charts are hard to read and don't provide enough filtering options.",
        followUps: [
          {
            question: "What specific analytics features would be most valuable to you?",
            answer:
              "I need the ability to compare data across different time periods and export reports in various formats. Also, customizable dashboards would be great.",
          },
        ],
      },
      {
        questionId: "2",
        answer:
          "The customer support team has been very responsive, but sometimes they don't seem to have access to my account history which leads to repetitive explanations.",
        followUps: [
          {
            question: "How has this affected your overall experience with our product?",
            answer:
              "It's frustrating to repeat information, but the team is always polite. I'd rate the experience 7/10 overall.",
          },
        ],
      },
    ],
  },
  {
    id: "resp2",
    name: "Taylor Smith",
    responses: [
      {
        questionId: "1",
        answer:
          "The mobile app needs significant improvement. It crashes frequently and the UI feels outdated compared to your web version.",
        followUps: [
          {
            question: "Which specific features of the mobile app do you use most frequently?",
            answer:
              "I primarily use the task management and notification features. The calendar integration is also important to me.",
          },
        ],
      },
      {
        questionId: "2",
        answer:
          "Customer support has been excellent. They resolved my billing issue within minutes and followed up to ensure everything was working properly.",
        followUps: [],
      },
    ],
  },
]

export default function SurveyEditorPage() {
  // View state
  const [currentView, setCurrentView] = useState<"plan" | "questions" | "insights">("plan")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Survey Context state
  const [problemStatement, setProblemStatement] = useState(
    "We need to understand why our user engagement has dropped by 23% after our latest product update.",
  )
  const [successCriteria, setSuccessCriteria] = useState(
    "Identify the top 3 friction points in our new interface; Determine which features users find most valuable; Understand user expectations for the next release",
  )
  const [targetUsers, setTargetUsers] = useState(
    "Active users who have used both the old and new versions; Users who have reduced their usage in the last 30 days",
  )

  // Hypotheses state
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([
    {
      id: "h1",
      text: "Users are struggling with the new dashboard layout because the information architecture is not intuitive.",
      isTestable: true,
    },
    {
      id: "h2",
      text: "The mobile experience is causing frustration because it lacks feature parity with the desktop version.",
      isTestable: true,
    },
  ])

  // Convert hypotheses array to string format for the context page
  const hypothesesString = hypotheses.map((h) => h.text).join("; ")

  // Handler to update hypotheses from the context page
  const handleHypothesesChange = (value: string) => {
    const newHypotheses = value.split(";").map((text, index) => ({
      id: hypotheses[index]?.id || `h${index + 1}`,
      text: text.trim(),
      isTestable: true,
    }))
    setHypotheses(newHypotheses)
  }

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "conversational_question",
      title: "What features would you like to see improved in our product?",
      required: true,
      aiFollowUp: {
        enabled: true,
        probeDepth: "medium",
        customDepth: 50,
      },
      hypothesisIds: ["h1"],
    },
    {
      id: "2",
      type: "conversational_question",
      title: "How has your experience been with our customer support team?",
      required: false,
      aiFollowUp: {
        enabled: true,
        probeDepth: "auto",
        customDepth: 30,
      },
      hypothesisIds: ["h2"],
    },
  ])

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  // Sample respondent data
  const [respondents, setRespondents] = useState(sampleRespondents)

  // Auto-save functionality
  const { saveStatus } = useAutoSave(questions)
  const isMobile = useIsMobile()

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "conversational_question",
      title: "New Conversational Question",
      required: false,
      aiFollowUp: {
        enabled: false,
        probeDepth: "auto",
        customDepth: 30,
      },
    }

    setQuestions([...questions, newQuestion])
    // Select the new question to ensure it's visible
    setSelectedQuestionId(newQuestion.id)
  }

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null)
    }
  }

  const handleReorderQuestions = (reorderedQuestions: Question[]) => {
    setQuestions(reorderedQuestions)
  }

  // Handle linking a question to hypotheses
  const handleLinkHypothesis = (questionId: string, hypothesisIds: string[]) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            hypothesisIds: hypothesisIds.length > 0 ? hypothesisIds : undefined,
          }
        }
        return q
      }),
    )
  }

  // Handle adding a new hypothesis
  const handleAddHypothesis = (hypothesis: Hypothesis) => {
    setHypotheses([...hypotheses, hypothesis])
  }

  // Handle generating questions based on survey context and hypotheses
  const handleGenerateQuestions = () => {
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll create questions based on the hypotheses and context

    // Create a set of question templates that we can use
    const questionTemplates = [
      "What features would you like to see improved in our product?",
      "How would you describe your overall experience with our product?",
      "What challenges have you faced when using our product?",
      "What aspects of our interface do you find most confusing or difficult to understand?",
      "What tasks do you find most difficult to accomplish with our product?",
      "What value or benefits do you expect to get from using our product?",
      "How has your experience been with our customer support team?",
      "What would make you more likely to recommend our product to others?",
      "What features do you find most valuable in our product?",
      "Is there anything else you'd like to share about your experience with our product?",
    ]

    // Shuffle the templates to get a random selection
    const shuffledTemplates = [...questionTemplates].sort(() => 0.5 - Math.random())

    // Create exactly 5 questions
    const newQuestions: Question[] = []

    // First, create questions for each hypothesis (up to 2)
    hypotheses.forEach((hypothesis, index) => {
      if (index < 2) {
        const newQuestion: Question = {
          id: (Date.now() + index).toString(),
          type: "conversational_question",
          title: shuffledTemplates[index],
          required: index === 0, // Make the first question required
          aiFollowUp: {
            enabled: true,
            probeDepth: "medium",
            customDepth: 50,
          },
          hypothesisIds: [hypothesis.id],
        }
        newQuestions.push(newQuestion)
      }
    })

    // Then add additional questions to reach exactly 5
    for (let i = newQuestions.length; i < 5; i++) {
      const newQuestion: Question = {
        id: (Date.now() + i).toString(),
        type: "conversational_question",
        title: shuffledTemplates[i],
        required: false,
        aiFollowUp: {
          enabled: true,
          probeDepth: i === 4 ? "high" : "medium", // Make the last question high depth
          customDepth: i === 4 ? 70 : 50,
        },
      }
      newQuestions.push(newQuestion)
    }

    // Update the questions state
    setQuestions(newQuestions)

    // Select the first question (but don't navigate)
    if (newQuestions.length > 0) {
      setSelectedQuestionId(newQuestions[0].id)
    }

    // Don't switch to the questions view
    // setCurrentView("questions");
  }

  // Get survey context for AI suggestions
  const surveyContext = {
    problemStatement,
    successCriteria,
    targetUsers,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar - Desktop */}
      <div
        className={cn(
          "fixed left-6 top-1/2 transform -translate-y-1/2 z-10 floating-toolbar",
          isMobile ? "hidden" : "flex",
        )}
      >
        <div className="bg-white rounded-lg shadow-md flex flex-col items-center py-3 border border-gray-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-md m-1 relative hover:bg-[#F1F3FF] hover:text-[#3A7CFF] transition-colors",
                    currentView === "plan" && "text-[#3A7CFF] bg-[#F1F3FF]",
                  )}
                  onClick={() => setCurrentView("plan")}
                >
                  <ClipboardCheck className="h-5 w-5" strokeWidth={1.5} />
                  {currentView === "plan" && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-[#3A7CFF] rounded-r-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Context</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-8 h-px bg-[#EFEFEF] my-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-md m-1 relative hover:bg-[#F1F3FF] hover:text-[#3A7CFF] transition-colors",
                    currentView === "questions" && "text-[#3A7CFF] bg-[#F1F3FF]",
                  )}
                  onClick={() => setCurrentView("questions")}
                >
                  <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
                  {currentView === "questions" && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-[#3A7CFF] rounded-r-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Questions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-8 h-px bg-[#EFEFEF] my-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-md m-1 relative hover:bg-[#F1F3FF] hover:text-[#3A7CFF] transition-colors",
                    currentView === "insights" && "text-[#3A7CFF] bg-[#F1F3FF]",
                  )}
                  onClick={() => setCurrentView("insights")}
                >
                  <BarChart3 className="h-5 w-5" strokeWidth={1.5} />
                  {currentView === "insights" && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-[#3A7CFF] rounded-r-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Insights</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed top-0 left-0 w-full h-full bg-white z-20 transform transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="p-4 border-b">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col p-4">
            <Button
              variant="ghost"
              className={cn("justify-start py-3 text-lg font-medium", currentView === "plan" && "text-[#3A7CFF]")}
              onClick={() => {
                setCurrentView("plan")
                setIsMobileMenuOpen(false)
              }}
            >
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Context
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start py-3 text-lg font-medium", currentView === "questions" && "text-[#3A7CFF]")}
              onClick={() => {
                setCurrentView("questions")
                setIsMobileMenuOpen(false)
              }}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Questions
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start py-3 text-lg font-medium", currentView === "insights" && "text-[#3A7CFF]")}
              onClick={() => {
                setCurrentView("insights")
                setIsMobileMenuOpen(false)
              }}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Insights
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <SurveyEditorHeader saveStatus={saveStatus} />

        {/* Content Area */}
        <ContentWrapper>
          {currentView === "plan" && (
            <SurveyContextPage
              problemStatement={problemStatement}
              onProblemStatementChange={setProblemStatement}
              successCriteria={successCriteria}
              onSuccessCriteriaChange={setSuccessCriteria}
              targetUsers={targetUsers}
              onTargetUsersChange={setTargetUsers}
              hypotheses={hypothesesString}
              onHypothesesChange={handleHypothesesChange}
              onBack={() => setCurrentView("questions")}
              onGenerateQuestions={handleGenerateQuestions}
            />
          )}

          {currentView === "questions" && (
            <QuestionsSection
              questions={questions}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
              onAddQuestion={handleAddQuestion}
              onLinkHypothesis={handleLinkHypothesis}
              hypotheses={hypotheses}
              onAddHypothesis={handleAddHypothesis}
              surveyContext={surveyContext}
            />
          )}

          {currentView === "insights" && (
            <InsightsPage
              problemStatement={problemStatement}
              hypotheses={hypotheses}
              questions={questions}
              respondents={respondents}
            />
          )}
        </ContentWrapper>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2 left-2 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
