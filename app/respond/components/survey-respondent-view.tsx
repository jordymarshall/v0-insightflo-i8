"use client"

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ImpactTracker from "./impact-tracker"
import QuestionBubble from "./question-bubble"
import SpotlightAnswer from "./spotlight-answer"
import AnswerInput from "./answer-input"
import WelcomeScreen from "./welcome-screen"
import PreSurveyForm, { type PreSurveyData } from "./pre-survey-form"
import ThankYouMural from "./thank-you-mural"
import { useMediaQuery } from "@/hooks/use-media-query"
import MicroCelebration from "./micro-celebration"
import chatScroll from "../utils/chat-scroll"
import { EyeIcon } from "lucide-react"

// Sample survey data - in a real app, this would come from an API
const sampleSurvey = {
  id: "survey-123",
  title: "Chat Interview",
  description: "Help us learn by sharing your experience",
  questions: [
    {
      id: "q1",
      type: "conversational_question",
      title:
        "What features would you like to see improved in our product? We'd love to hear your detailed thoughts on this.",
      required: true,
      isKeyQuestion: true, // First question is a key question
      aiFollowUp: {
        enabled: true,
        probeDepth: "medium",
        required: false, // Follow-ups are not required
      },
    },
    {
      id: "q2",
      type: "conversational_question",
      title:
        "How has your experience been with our customer support team? Feel free to share specific examples that stand out to you.",
      required: false,
      isKeyQuestion: true, // This appears after an acknowledgment
      aiFollowUp: {
        enabled: true,
        probeDepth: "auto",
        required: false, // Follow-ups are not required
      },
    },
    {
      id: "q3",
      type: "conversational_question",
      title:
        "What aspects of our product do you find most valuable in your day-to-day work? Please describe how they help you specifically.",
      description: "We'd love to understand how our product fits into your workflow in as much detail as possible",
      required: true,
      isKeyQuestion: true, // This appears after an acknowledgment
      aiFollowUp: {
        enabled: true,
        probeDepth: "high",
        required: false, // Follow-ups are not required
      },
    },
  ],
}

// Types for responses
interface FollowUpResponse {
  questionId: string
  question: string
  answer: string
}

interface QuestionResponse {
  questionId: string
  answer: string
  followUps: FollowUpResponse[]
  skipped?: boolean
}

// Interface for chat messages to maintain conversation history
interface ChatMessage {
  id: string
  type:
    | "question"
    | "answer"
    | "followup-question"
    | "followup-answer"
    | "acknowledgment"
    | "typing"
    | "skipped"
    | "affirmation"
    | "transition"
    | "emoji-poll"
    | "micro-celebration"
  content: string
  isKeyQuestion?: boolean
  description?: string
  isActive?: boolean
  questionNumber?: number
  totalQuestions?: number
  isLastQuestion?: boolean
}

// Interface for experience feedback
interface ExperienceFeedback {
  experience: string
  futureParticipation: boolean
}

interface SurveyRespondentViewProps {
  previewMode?: boolean
}

// Sample answers for auto-filling in preview mode
const sampleAnswers = [
  "I think the user interface could be more intuitive. Sometimes I struggle to find basic features, and the navigation menu feels cluttered. It would be great if you could simplify the layout and make the most common actions more accessible. Also, the search functionality could be improved to show more relevant results.",
  "My experience with the customer support team has been excellent. They're always responsive and helpful. Last month, I had an issue with billing, and Sarah from the support team resolved it within hours. She was patient and explained everything clearly. I really appreciate the personal touch.",
  "The analytics dashboard is by far the most valuable feature for me. I use it daily to track our team's performance and make data-driven decisions. The ability to customize reports and export data has saved me hours of work each week. I also appreciate the mobile app which lets me check important metrics on the go.",
]

// Sample follow-up answers
const sampleFollowUpAnswers = [
  "It's important because it directly impacts my productivity. When I can't find features quickly, I waste time clicking around instead of getting work done. A more intuitive interface would help me complete tasks faster and with less frustration. I estimate I could save 30 minutes daily with better navigation.",
  "A specific example would be when I needed to generate a custom report for my manager. The support team not only helped me create it but also showed me how to save the template for future use. This level of support goes beyond just fixing problems - it's about empowering users to get more value from the product.",
  "The real-time collaboration features have significantly improved our team's workflow. Before using your product, we had to email files back and forth, which led to version control issues. Now we can all work on the same document simultaneously, which has eliminated confusion and streamlined our process.",
]

export default function SurveyRespondentView({ previewMode = false }: SurveyRespondentViewProps) {
  const [currentStep, setCurrentStep] = useState(-1) // -1 for welcome screen, 0 for pre-survey, questions start at 1
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [currentFollowUp, setCurrentFollowUp] = useState<{
    questionId: string
    question: string
    previousAnswer: string
  } | null>(null)
  const [followUpAnswer, setFollowUpAnswer] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastResponseAdded, setLastResponseAdded] = useState(false)
  const [showEmojiPoll, setShowEmojiPoll] = useState(false)
  const [keyInsights, setKeyInsights] = useState<string[]>([])
  const [completedKeyQuestions, setCompletedKeyQuestions] = useState(0)
  const [showFinalCelebration, setShowFinalCelebration] = useState(false)
  const [insightsCount, setInsightsCount] = useState(0) // Track insights count here
  const [latestQuestionId, setLatestQuestionId] = useState<string | null>(null)
  const [shouldScrollToLatestQuestion, setShouldScrollToLatestQuestion] = useState(false)
  const [inputAreaHeight, setInputAreaHeight] = useState(0) // Track input area height
  const [chatScrollPosition, setChatScrollPosition] = useState(0) // Track chat scroll position
  const [lastMessageHeight, setLastMessageHeight] = useState(0) // Track height of last message
  const [messageCount, setMessageCount] = useState(0) // Track message count for forced re-renders

  const [showAcknowledgment, setShowAcknowledgment] = useState(false)
  const [currentAcknowledgment, setCurrentAcknowledgment] = useState("")
  const [isFinalQuestion, setIsFinalQuestion] = useState(false)
  const [followUpCount, setFollowUpCount] = useState(0)
  const [maxFollowUps, setMaxFollowUps] = useState(2) // Maximum follow-ups per question

  // Pre-survey data
  const [preSurveyData, setPreSurveyData] = useState<PreSurveyData | null>(null)

  // Experience feedback
  const [experienceFeedback, setExperienceFeedback] = useState<ExperienceFeedback | null>(null)

  // Chat history to maintain conversation
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const latestQuestionRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const newMessageRef = useRef<HTMLDivElement>(null)

  // Enable debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      chatScroll.setDebug(true)
    }
  }, [])

  // Update the main content padding based on input area height
  const updateMainContentPadding = useCallback(() => {
    if (inputAreaRef.current && mainContentRef.current) {
      const height = inputAreaRef.current.offsetHeight
      setInputAreaHeight(height)
      mainContentRef.current.style.paddingBottom = `${height}px`
    }
  }, [])

  // Check if the device is mobile
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Reset textarea height to default
  const resetTextareaHeight = useCallback(() => {
    if (textAreaRef.current) {
      // Set a default height (adjust as needed)
      textAreaRef.current.style.height = "125px"
    }
  }, [])

  // Reset last response added flag
  const resetLastResponseAdded = () => {
    setLastResponseAdded(false)
  }

  // IMPROVED: Add a message to chat history with better scrolling
  const addToChatHistory = (message: ChatMessage) => {
    // Mark all previous messages as inactive
    setChatHistory((prev) => {
      const updatedHistory = prev.map((msg) => ({
        ...msg,
        isActive: false,
      }))

      // Add the new message as active
      return [...updatedHistory, { ...message, isActive: true }]
    })

    // If this is a question or follow-up question, set it as the latest question
    if (message.type === "question" || message.type === "followup-question") {
      setLatestQuestionId(message.id)
    }

    // Increment message count to force re-renders
    setMessageCount((prev) => prev + 1)

    // Schedule multiple scroll attempts after state update
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatScroll.scrollToBottom(chatContainerRef.current)
      }
    }, 0)
  }

  // Auto-fill pre-survey data for preview mode
  const getPreviewPreSurveyData = (): PreSurveyData => {
    return {
      name: "John Smith",
      email: "john.smith@example.com",
      additionalInfo: "Product Manager at Acme Corp",
    }
  }

  // Handle completing the pre-survey form
  const handlePreSurveyComplete = (data: PreSurveyData) => {
    // Log preview mode action instead of actual submission
    if (previewMode) {
      console.log("[PREVIEW MODE] Pre-survey data:", data)
    }

    setPreSurveyData(data)
    setIsTransitioning(true)

    // Add a transition message
    addToChatHistory({
      id: `transition-to-survey-${Date.now()}`,
      type: "transition",
      content: `Thanks ${data.name}! Let's begin our conversation.`,
    })

    // Move to the first question immediately
    setCurrentStep(1)

    // Add first question to chat history
    const firstQuestion = sampleSurvey.questions[0]
    const questionId = `question-${firstQuestion.id}`
    addToChatHistory({
      id: questionId,
      type: "question",
      content: firstQuestion.title,
      isKeyQuestion: true,
      description: firstQuestion.description,
    })

    setIsTransitioning(false)
  }

  // Handle going back from pre-survey to welcome screen
  const handleBackToWelcome = () => {
    setCurrentStep(-1)
  }

  // Handle submitting experience feedback
  const handleSubmitFeedback = (feedback: ExperienceFeedback) => {
    // In preview mode, just log the feedback instead of submitting
    if (previewMode) {
      console.log("[PREVIEW MODE] Experience feedback:", feedback)
    } else {
      // In a real app, you would send this to your API
      console.log("Experience feedback:", feedback)
    }

    setExperienceFeedback(feedback)
  }

  // Check if an answer is detailed (more than 20 words)
  const isDetailedAnswer = (answer: string): boolean => {
    const wordCount = answer.trim().split(/\s+/).length
    return wordCount >= 20
  }

  // Simulate AI generating follow-up questions
  const generateFollowUpQuestion = (questionId: string, answer: string) => {
    // Increment follow-up count
    const newFollowUpCount = followUpCount + 1
    setFollowUpCount(newFollowUpCount)

    // Check if we've reached the maximum follow-ups
    if (newFollowUpCount >= maxFollowUps) {
      // If we've reached max follow-ups, show acknowledgment and proceed
      showAcknowledgmentAndProceed()
      return
    }

    setIsTyping(true)

    // Add typing indicator to chat history
    addToChatHistory({
      id: `typing-${Date.now()}`,
      type: "typing",
      content: "typing",
    })

    // Simulate API delay
    setTimeout(
      () => {
        // Remove typing indicator
        setChatHistory((prev) => {
          const filteredHistory = prev.filter((msg) => msg.type !== "typing")

          // Schedule a scroll after removing typing indicator
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatScroll.scrollToBottom(chatContainerRef.current)
            }
          }, 0)

          return filteredHistory
        })

        // Wait for DOM update after removing typing indicator
        setTimeout(() => {
          // Enhanced follow-up questions with conversational nudges
          const followUpQuestions = [
            `You mentioned "${answer.substring(0, 30)}${
              answer.length > 30 ? "..." : ""
            }". Could you elaborate a bit more on why that's important to you? We'd love to hear more details.`,
            `That's interesting about ${answer.substring(0, 20)}${
              answer.length > 20 ? "..." : ""
            }. Could you share a specific example or experience related to this? The more detail, the better!`,
            `Thanks for sharing. When you think about "${answer.substring(0, 25)}${
              answer.length > 25 ? "..." : ""
            }", what specific aspects would you prioritize improving? Please explain your reasoning in detail.`,
            `I'd love to hear more about your experience with this. Could you walk me through how this specifically affects your workflow or daily activities?`,
            `That's valuable feedback. Could you tell me more about when you first noticed this, and how your perspective has evolved over time?`,
          ]

          const randomQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]

          setCurrentFollowUp({
            questionId,
            question: randomQuestion,
            previousAnswer: answer,
          })

          // Add follow-up question to chat history
          const followUpId = `followup-question-${questionId}-${newFollowUpCount}`
          addToChatHistory({
            id: followUpId,
            type: "followup-question",
            content: randomQuestion,
            isKeyQuestion: false,
          })

          setShowFollowUp(true)
          setIsTyping(false)

          // Auto-fill follow-up answer in preview mode with skip forward
          if (previewMode && window.autoFillEnabled) {
            const sampleAnswer = sampleFollowUpAnswers[Math.floor(Math.random() * sampleFollowUpAnswers.length)]
            setFollowUpAnswer(sampleAnswer)

            // Auto-submit after a short delay
            setTimeout(() => {
              handleSubmitFollowUp()
            }, 500)
          }
        }, 50)
      },
      previewMode ? 800 : 1500,
    ) // Faster in preview mode
  }

  // Generate a random acknowledgment message
  const getRandomAcknowledgment = (isFinal = false) => {
    const standardAcknowledgments = [
      "Got it! Thanks for sharing those details. Let's move on to the next question.",
      "Thanks for sharing all that! Your detailed perspective is really valuable. Now for something different.",
      "I appreciate your thorough responses. This helps us understand your experience better. Let's continue.",
      "That's really helpful to know. Your specific examples make a big difference. Moving on...",
      "Thanks for your thoughtful feedback. These details will help us improve. Let's explore another area.",
    ]

    const finalAcknowledgments = [
      "Thank you for all your detailed responses! Your insights are incredibly valuable.",
      "That's all the questions we have. Thanks for taking the time to share such thoughtful feedback!",
      "We really appreciate all your insights and the specific examples you've shared.",
      "Thanks for completing this section! Your detailed responses will help us improve our product.",
    ]

    const acknowledgments = isFinal ? finalAcknowledgments : standardAcknowledgments
    return acknowledgments[Math.floor(Math.random() * acknowledgments.length)]
  }

  // Show acknowledgment and proceed to next question
  const showAcknowledgmentAndProceed = () => {
    // Check if this is the final question
    const isLastQuestion = currentStep === sampleSurvey.questions.length
    setIsFinalQuestion(isLastQuestion)

    // Generate acknowledgment message
    const acknowledgment = getRandomAcknowledgment(isLastQuestion)
    setCurrentAcknowledgment(acknowledgment)

    // Check if the current question is a key question
    const currentQuestion = sampleSurvey.questions[currentStep - 1]

    // Only increment the completedKeyQuestions counter here, after all follow-ups are completed
    if (currentQuestion.isKeyQuestion) {
      // Increment the completed key questions counter
      setCompletedKeyQuestions((prev) => prev + 1)

      // Add micro-celebration to chat history
      addToChatHistory({
        id: `micro-celebration-${currentStep}-${Date.now()}`,
        type: "micro-celebration",
        content: "micro-celebration",
        questionNumber: completedKeyQuestions + 1, // Pass the incremented count
        totalQuestions: sampleSurvey.questions.filter((q) => q.isKeyQuestion).length,
        isLastQuestion: isLastQuestion || currentStep === sampleSurvey.questions.length,
      })
    }

    setShowAcknowledgment(false) // We're not showing the acknowledgment anymore
    setIsTransitioning(true)

    // Show final celebration if this is the last question and we've completed all follow-ups
    if (isLastQuestion) {
      setShowFinalCelebration(true)
    }

    // After showing acknowledgment, move to next question or complete
    setTimeout(
      () => {
        setShowAcknowledgment(false)

        if (!isLastQuestion) {
          // Move to next question
          handleNextQuestion()
        } else {
          // Add a final transition message before completion
          addToChatHistory({
            id: `transition-to-completion-${Date.now()}`,
            type: "transition",
            content: "We've reached the end of our conversation. Thank you for your time!",
          })

          // Complete immediately
          setIsComplete(true)
          setIsTransitioning(false)
        }

        // Reset follow-up count for the next question
        setFollowUpCount(0)
      },
      previewMode ? 500 : 1000,
    ) // Faster in preview mode
  }

  // Handle skipping a question
  const handleSkipQuestion = () => {
    if (currentStep >= 1 && currentStep <= sampleSurvey.questions.length) {
      const questionIndex = currentStep - 1
      const currentQuestion = sampleSurvey.questions[questionIndex]

      // Don't allow skipping required questions
      if (currentQuestion.required) {
        return
      }

      setIsSubmitting(true)

      // Add skipped response
      const newResponse: QuestionResponse = {
        questionId: currentQuestion.id,
        answer: "",
        followUps: [],
        skipped: true,
      }

      setResponses((prev) => [...prev, newResponse])

      // Add skipped message to chat history
      addToChatHistory({
        id: `skipped-${currentQuestion.id}`,
        type: "skipped",
        content: "Question skipped",
      })

      setIsSubmitting(false)

      // Show acknowledgment and proceed to next question
      showAcknowledgmentAndProceed()
    }
  }

  // Handle submitting the current answer
  const handleSubmitAnswer = () => {
    if (currentStep >= 1 && currentStep <= sampleSurvey.questions.length) {
      const questionIndex = currentStep - 1
      const currentQuestion = sampleSurvey.questions[questionIndex]

      // Don't proceed if the question is required and the answer is empty
      if (currentQuestion.required && !currentAnswer.trim()) {
        return
      }

      // Check if the answer has at least "good detail" (10+ words)
      const wordCount = currentAnswer.trim().split(/\s+/).length
      if (wordCount < 10) {
        return // Don't submit if detail is poor
      }

      setIsSubmitting(true)

      // In preview mode, just log the action
      if (previewMode) {
        console.log("[PREVIEW MODE] Submitted answer:", {
          questionId: currentQuestion.id,
          answer: currentAnswer,
        })
      }

      // Simulate API call to submit answer
      setTimeout(
        () => {
          // Check if the answer is detailed
          const detailed = isDetailedAnswer(currentAnswer)

          // Add response to the list
          const newResponse: QuestionResponse = {
            questionId: currentQuestion.id,
            answer: currentAnswer,
            followUps: [],
          }

          setResponses((prev) => [...prev, newResponse])

          // Store the answer before clearing it
          const submittedAnswer = currentAnswer

          // Add user's answer to chat history
          addToChatHistory({
            id: `answer-${currentQuestion.id}`,
            type: "answer",
            content: submittedAnswer,
          })

          // Only trigger the insight unlocked animation and increment counter if there's actual content in the answer
          if (submittedAnswer.trim().length > 0) {
            setInsightsCount((prev) => prev + 1) // Increment insights count
            setLastResponseAdded(true)
          }

          setIsSubmitting(false)
          setCurrentAnswer("")

          // Reset textarea height to default
          resetTextareaHeight()

          // Update the main content padding after submission
          updateMainContentPadding()

          // Check if this question has follow-ups enabled
          if (currentQuestion.aiFollowUp.enabled && submittedAnswer.trim()) {
            generateFollowUpQuestion(currentQuestion.id, submittedAnswer)
          } else {
            // If no follow-ups, show acknowledgment and proceed
            showAcknowledgmentAndProceed()
          }
        },
        previewMode ? 300 : 500,
      ) // Faster in preview mode
    }
  }

  // Handle submitting a follow-up answer
  const handleSubmitFollowUp = () => {
    if (currentFollowUp && followUpAnswer.trim()) {
      // Check if the answer has at least "good detail" (10+ words)
      const wordCount = followUpAnswer.trim().split(/\s+/).length
      if (wordCount < 10) {
        return // Don't submit if detail is poor
      }

      setIsSubmitting(true)

      // In preview mode, just log the action
      if (previewMode) {
        console.log("[PREVIEW MODE] Submitted follow-up answer:", {
          questionId: currentFollowUp.questionId,
          question: currentFollowUp.question,
          answer: followUpAnswer,
        })
      }

      // Simulate API call to submit follow-up answer
      setTimeout(
        () => {
          // Add follow-up response to the corresponding question response
          setResponses((prev) =>
            prev.map((response) => {
              if (response.questionId === currentFollowUp.questionId) {
                return {
                  ...response,
                  followUps: [
                    ...response.followUps,
                    {
                      questionId: `${currentFollowUp.questionId}-followup-${response.followUps.length + 1}`,
                      question: currentFollowUp.question,
                      answer: followUpAnswer,
                    },
                  ],
                }
              }
              return response
            }),
          )

          // Store the answer before clearing it
          const submittedFollowUpAnswer = followUpAnswer

          // Add follow-up answer to chat history
          addToChatHistory({
            id: `followup-answer-${currentFollowUp.questionId}-${followUpCount}`,
            type: "followup-answer",
            content: submittedFollowUpAnswer,
          })

          // Only trigger the insight unlocked animation and increment counter if there's actual content in the answer
          if (submittedFollowUpAnswer.trim().length > 0) {
            setInsightsCount((prev) => prev + 1) // Increment insights count
            setLastResponseAdded(true)
          }

          setIsSubmitting(false)

          // Reset follow-up state
          setShowFollowUp(false)
          setCurrentFollowUp(null)

          // Store the answer before clearing it (for potential follow-up generation)
          const answerForFollowUp = submittedFollowUpAnswer
          setFollowUpAnswer("")

          // Reset textarea height to default
          resetTextareaHeight()

          // Update the main content padding after submission
          updateMainContentPadding()

          // Check if we should generate another follow-up or move on
          const questionIndex = currentStep - 1
          const currentQuestion = sampleSurvey.questions[questionIndex]
          if (currentQuestion.aiFollowUp.enabled && followUpCount < maxFollowUps - 1) {
            generateFollowUpQuestion(currentQuestion.id, answerForFollowUp)
          } else {
            // If we've reached max follow-ups, show acknowledgment and proceed
            showAcknowledgmentAndProceed()
          }
        },
        previewMode ? 300 : 500,
      ) // Faster in preview mode
    }
  }

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentStep < sampleSurvey.questions.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setCurrentAnswer("")

      // Add typing indicator to chat history
      addToChatHistory({
        id: `typing-next-${Date.now()}`,
        type: "typing",
        content: "typing",
      })

      // Wait for DOM update after adding typing indicator
      setTimeout(() => {
        // Remove typing indicator
        setChatHistory((prev) => {
          const filteredHistory = prev.filter((msg) => msg.type !== "typing")

          // Schedule a scroll after removing typing indicator
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatScroll.scrollToBottom(chatContainerRef.current)
            }
          }, 0)

          return filteredHistory
        })

        // Wait for DOM update after removing typing indicator
        setTimeout(() => {
          // Add next question to chat history
          const questionIndex = nextStep - 1
          const nextQuestion = sampleSurvey.questions[questionIndex]

          // All questions that appear after acknowledgments are key questions
          const questionId = `question-${nextQuestion.id}`
          addToChatHistory({
            id: questionId,
            type: "question",
            content: nextQuestion.title,
            isKeyQuestion: true, // Mark as key question
            description: nextQuestion.description,
          })

          // Reset follow-up count for the new question
          setFollowUpCount(0)
          setIsTransitioning(false)

          // Auto-fill answer in preview mode with skip forward
          if (previewMode && window.autoFillEnabled) {
            const questionIndex = nextStep - 1
            if (questionIndex < sampleAnswers.length) {
              setCurrentAnswer(sampleAnswers[questionIndex])

              // Auto-submit after a short delay
              setTimeout(() => {
                handleSubmitAnswer()
              }, 500)
            }
          }
        }, 50)
      }, 50)
    } else {
      // Survey is complete
      setIsComplete(true)
    }
  }

  // Move to the previous question
  const handlePreviousQuestion = () => {
    if (showFollowUp) {
      // If showing a follow-up, go back to the main question
      setShowFollowUp(false)
      setCurrentFollowUp(null)
      setFollowUpAnswer("")
      setFollowUpCount(0)

      // Remove last follow-up from chat history
      setChatHistory((prev) => {
        const newHistory = [...prev]
        // Find and remove the last followup question and answer
        const lastFollowupQuestionIndex = newHistory.findIndex((msg) => msg.type === "followup-question")
        if (lastFollowupQuestionIndex !== -1) {
          newHistory.splice(lastFollowupQuestionIndex, 1)
        }

        const lastFollowupAnswerIndex = newHistory.findIndex((msg) => msg.type === "followup-answer")
        if (lastFollowupAnswerIndex !== -1) {
          newHistory.splice(lastFollowupAnswerIndex, 1)
        }

        return newHistory
      })
    } else if (currentStep > 1) {
      // Go back to the previous question
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)

      // Get the previous question index
      const questionIndex = prevStep - 1

      // Restore the previous answer
      const previousResponse = responses.find((r) => r.questionId === sampleSurvey.questions[questionIndex].id)

      if (previousResponse) {
        setCurrentAnswer(previousResponse.answer)

        // Remove the previous response
        setResponses((prev) => prev.filter((r) => r.questionId !== previousResponse.questionId))
      }

      // Reset follow-up count
      setFollowUpCount(0)

      // Update chat history - remove everything after the previous question's answer
      setChatHistory((prev) => {
        const prevQuestionId = sampleSurvey.questions[questionIndex].id
        const prevAnswerIndex = prev.findIndex((msg) => msg.type === "answer" && msg.id === `answer-${prevQuestionId}`)

        if (prevAnswerIndex !== -1) {
          return prev.slice(0, prevAnswerIndex + 1)
        }
        return prev
      })

      // Set the previous question as the latest question
      setLatestQuestionId(`question-${sampleSurvey.questions[questionIndex].id}`)
    } else if (currentStep === 1) {
      // Go back to the pre-survey form
      setCurrentStep(0)
      // Clear chat history
      setChatHistory([])
    } else if (currentStep === 0) {
      // Go back to the welcome screen
      setCurrentStep(-1)
      setPreSurveyData(null)
    }
  }

  // Start the survey
  const handleStartSurvey = () => {
    // Move to pre-survey form
    setCurrentStep(0)

    // Auto-fill pre-survey in preview mode with skip forward
    if (previewMode && window.autoFillEnabled) {
      setTimeout(() => {
        handlePreSurveyComplete(getPreviewPreSurveyData())
      }, 500)
    }
  }

  // Register message ref
  const registerMessageRef = useCallback(
    (id: string, node: HTMLDivElement | null) => {
      if (node) {
        messageRefs.current.set(id, node)

        // If this is a new message, store it in newMessageRef for scroll measurement
        if (chatHistory.length > 0 && id === chatHistory[chatHistory.length - 1].id) {
          newMessageRef.current = node

          // Scroll to make the new message visible
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatScroll.scrollToBottom(chatContainerRef.current)
            }
          }, 50)
        }
      } else {
        messageRefs.current.delete(id)
      }
    },
    [chatHistory],
  )

  // Monitor input area height changes
  useEffect(() => {
    if (!inputAreaRef.current) return

    updateMainContentPadding()

    const resizeObserver = new ResizeObserver(() => {
      updateMainContentPadding()
    })

    resizeObserver.observe(inputAreaRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateMainContentPadding])

  // Use useLayoutEffect to ensure DOM updates before scrolling
  useLayoutEffect(() => {
    // Initial update of main content padding
    updateMainContentPadding()
  }, [updateMainContentPadding])

  // Add this useEffect to scroll when chat history changes
  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      chatScroll.scrollToBottom(chatContainerRef.current)
    }
  }, [chatHistory])

  // Add this useEffect to scroll when message count changes
  useEffect(() => {
    if (messageCount > 0 && chatContainerRef.current) {
      chatScroll.scrollToBottom(chatContainerRef.current)
    }
  }, [messageCount])

  // Add this useEffect to handle DOM mutations
  useEffect(() => {
    if (!chatContainerRef.current) return

    const observer = new MutationObserver(() => {
      if (chatContainerRef.current) {
        chatScroll.scrollToBottom(chatContainerRef.current)
      }
    })

    observer.observe(chatContainerRef.current, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Handle animation completion for scrolling
  const handleAnimationComplete = useCallback(() => {
    if (chatContainerRef.current) {
      chatScroll.scrollToBottom(chatContainerRef.current)
    }
  }, [])

  // Add this useEffect for preview mode
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PREVIEW_SKIP_FORWARD") {
        // Enable auto-fill for skip forward
        window.autoFillEnabled = true

        // Skip to next question or section
        if (currentStep === -1) {
          // From welcome to pre-survey
          setCurrentStep(0)
          // Auto-fill pre-survey
          setTimeout(() => {
            handlePreSurveyComplete(getPreviewPreSurveyData())
          }, 500)
        } else if (currentStep === 0) {
          // From pre-survey to first question
          handlePreSurveyComplete(getPreviewPreSurveyData())
        } else if (showFollowUp) {
          // Auto-fill follow-up answer
          const sampleAnswer = sampleFollowUpAnswers[Math.floor(Math.random() * sampleFollowUpAnswers.length)]
          setFollowUpAnswer(sampleAnswer)
          setTimeout(() => {
            handleSubmitFollowUp()
          }, 500)
        } else if (currentStep < sampleSurvey.questions.length) {
          // Auto-fill answer for current question
          const questionIndex = currentStep - 1
          if (questionIndex < sampleAnswers.length) {
            setCurrentAnswer(sampleAnswers[questionIndex])
            setTimeout(() => {
              handleSubmitAnswer()
            }, 500)
          } else {
            // Skip to next question
            handleNextQuestion()
          }
        } else if (!isComplete) {
          // Complete the survey
          setIsComplete(true)

          // Auto-fill experience feedback
          if (isComplete) {
            const feedback = {
              experience: "positive",
              futureParticipation: true,
            }
            handleSubmitFeedback(feedback)
          }
        }
      } else if (event.data.type === "PREVIEW_SKIP_BACK") {
        // Disable auto-fill for skip back
        window.autoFillEnabled = false

        // Go back to previous question or section
        handlePreviousQuestion()
      }
    }

    if (previewMode && typeof window !== "undefined") {
      // Add autoFillEnabled flag to window object
      window.autoFillEnabled = false

      window.addEventListener("message", handleMessage)
      return () => {
        window.removeEventListener("message", handleMessage)
      }
    }
  }, [previewMode, currentStep, isComplete, showFollowUp])

  // Special handling for mobile devices
  useEffect(() => {
    if (isMobile) {
      // On mobile, prevent body scrolling when in the chat view
      if (currentStep > 0) {
        document.body.style.overflow = "hidden"
        document.body.classList.add("fixed-body")
      } else {
        document.body.style.overflow = ""
        document.body.classList.remove("fixed-body")
      }
    }

    return () => {
      document.body.style.overflow = ""
      document.body.classList.remove("fixed-body")
    }
  }, [isMobile, currentStep])

  // Get the actual question index (adjusted for pre-survey step)
  const getQuestionIndex = () => {
    return currentStep - 1
  }

  // Render the appropriate message component based on type
  const renderMessage = (message: ChatMessage, index: number) => {
    const isLastMessage = index === chatHistory.length - 1
    const messageRef = isLastMessage ? lastMessageRef : null
    const isLatestQuestion = message.id === latestQuestionId
    const questionRef = isLatestQuestion ? latestQuestionRef : null

    // Create a ref callback that registers the message element
    const setMessageRef = (node: HTMLDivElement | null) => {
      registerMessageRef(message.id, node)

      // Also set the last message ref if this is the last message
      if (isLastMessage && messageRef && "current" in messageRef) {
        messageRef.current = node
      }

      // Also set the latest question ref if this is the latest question
      if (isLatestQuestion && questionRef && "current" in questionRef) {
        questionRef.current = node
      }
    }

    switch (message.type) {
      case "question":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-10">
            <QuestionBubble
              question={message.content}
              description={message.description}
              isKeyQuestion={message.isKeyQuestion}
              isActive={message.isActive}
            />
          </div>
        )
      case "followup-question":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-10">
            <QuestionBubble question={message.content} isActive={message.isActive} />
          </div>
        )
      case "answer":
      case "followup-answer":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-6">
            <SpotlightAnswer answer={message.content} isActive={message.isActive} />
          </div>
        )
      case "typing":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onAnimationComplete={handleAnimationComplete}
              className="flex"
            >
              <div className="conversation-bubble conversation-bubble-system rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </motion.div>
          </div>
        )
      case "transition":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={handleAnimationComplete}
              className="flex justify-center my-3 sm:my-4"
            >
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium">
                {message.content}
              </div>
            </motion.div>
          </div>
        )
      case "micro-celebration":
        return (
          <div ref={setMessageRef} key={message.id} className="mb-6">
            <MicroCelebration
              currentKeyQuestionNumber={message.questionNumber || 0}
              totalKeyQuestions={message.totalQuestions || sampleSurvey.questions.filter((q) => q.isKeyQuestion).length}
              isLastQuestion={message.isLastQuestion}
            />
          </div>
        )
      default:
        return null
    }
  }

  // Determine if we should use fixed positioning for mobile
  const useFixedPositioning = isMobile && currentStep > 0

  // For welcome, pre-survey, or completion screens
  if (currentStep <= 0 || isComplete) {
    if (currentStep === -1) {
      return (
        <WelcomeScreen
          key="welcome"
          title={sampleSurvey.title}
          description={sampleSurvey.description}
          onStart={handleStartSurvey}
        />
      )
    } else if (currentStep === 0) {
      return <PreSurveyForm onComplete={handlePreSurveyComplete} onBack={handleBackToWelcome} />
    } else {
      return (
        <ThankYouMural
          respondentName={preSurveyData?.name}
          onExit={() => {
            // In preview mode, just log the action
            if (previewMode) {
              console.log("[PREVIEW MODE] Exit survey")
              return
            }

            // Handle exit - in a real app this might redirect to a dashboard or home page
            console.log("Exiting survey")
          }}
        />
      )
    }
  }

  // Main survey chat interface
  return (
    <div
      className={`min-h-screen flex flex-col bg-white ${useFixedPositioning ? "fixed inset-0 overflow-hidden" : ""}`}
    >
      {/* Header with progress indicator */}
      <header
        className={`bg-white border-b border-gray-100 ${
          previewMode ? "py-2 pt-[64px]" : "py-4"
        } px-4 sm:px-6 z-10 shadow-sm flex-shrink-0 sticky top-0`}
      >
        {previewMode && (
          <div className="absolute top-4 left-0 right-0 flex justify-center items-center h-[36px] px-4 sm:px-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg py-1 px-3 text-xs text-blue-700 flex items-center h-[26px]">
              <EyeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="font-medium">Preview Mode</span>
            </div>
          </div>
        )}
        <div className="max-w-3xl sm:max-w-4xl mx-auto w-full">
          <ImpactTracker
            currentStep={getQuestionIndex()}
            totalSteps={sampleSurvey.questions.length}
            showFollowUp={showFollowUp}
            showAcknowledgment={showAcknowledgment}
            lastResponseAdded={lastResponseAdded}
            resetLastResponseAdded={resetLastResponseAdded}
            onPrevious={handlePreviousQuestion}
            showFinalCelebration={showFinalCelebration}
            insightsCount={insightsCount} // Pass the insights count to the component
          />
        </div>
      </header>

      {/* Main content area with padding at the bottom to make room for fixed input */}
      <main ref={chatContainerRef} className={`flex-1 overflow-y-auto`}>
        <div ref={mainContentRef} className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6">
          {/* Chat container */}
          <div className="py-5 space-y-6 sm:space-y-8 scrollbar-hide chat-container">
            {/* Render chat history */}
            <AnimatePresence mode="sync">
              {chatHistory.map((message, index) => renderMessage(message, index))}
            </AnimatePresence>
            {/* Bottom sentinel element for scrolling */}
            <div ref={bottomRef} aria-hidden />
          </div>
        </div>
      </main>

      {/* Fixed input area at the bottom */}
      <div ref={inputAreaRef} className="fixed bottom-0 left-0 right-0 py-4 px-4 sm:px-6 bg-white z-10">
        <div className="max-w-3xl sm:max-w-4xl mx-auto">
          {showFollowUp ? (
            <AnswerInput
              ref={textAreaRef}
              value={followUpAnswer}
              onChange={setFollowUpAnswer}
              onSubmit={handleSubmitFollowUp}
              isSubmitting={isSubmitting}
              required={true} // Follow-up questions are required since they can't be skipped
              placeholder="Share as much detail as you can about this specific point..."
            />
          ) : (
            currentStep >= 1 &&
            currentStep <= sampleSurvey.questions.length && (
              <AnswerInput
                ref={textAreaRef}
                value={currentAnswer}
                onChange={setCurrentAnswer}
                onSubmit={handleSubmitAnswer}
                onSkip={!sampleSurvey.questions[getQuestionIndex()].required ? handleSkipQuestion : undefined}
                isSubmitting={isSubmitting}
                required={sampleSurvey.questions[getQuestionIndex()].required}
                placeholder="Share as much detail as you can..."
              />
            )
          )}

          {/* Real-time feedback when typing */}
          {(currentAnswer.length > 0 || followUpAnswer.length > 0) && !isSubmitting && (
            <div className="mt-2">
              <MicroCelebration
                currentKeyQuestionNumber={completedKeyQuestions}
                totalKeyQuestions={sampleSurvey.questions.filter((q) => q.isKeyQuestion).length}
                responseText={showFollowUp ? followUpAnswer : currentAnswer}
                isTyping={true}
                showProgressMeter={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
