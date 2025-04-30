"use client"

import type React from "react"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Filter,
  GripVertical,
  Info,
  Lightbulb,
  LineChart,
  MessageSquare,
  Search,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
  Lock,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Question } from "../types/survey-types"
import type { Hypothesis } from "./hypotheses-band"
import PremiumFeatureModal from "./premium-feature-modal"
import { cn } from "@/lib/utils"

interface InsightsPageProps {
  problemStatement: string
  hypotheses: Hypothesis[]
  questions: Question[]
  respondents: Respondent[]
  onPremiumModalOpen?: () => void
}

// Define types for respondent data
interface FollowUp {
  question: string
  answer: string
}

interface Response {
  questionId: string
  answer: string
  followUps: FollowUp[]
  tags?: string[]
  highlights?: { text: string; startIndex: number; endIndex: number }[]
}

interface Respondent {
  id: string
  name: string
  responses: Response[]
}

// Define tag types with colors
interface Tag {
  id: string
  name: string
  color: string
}

// Function to generate a unique color for each hypothesis
const getHypothesisColor = (index: number): { bg: string; text: string; border: string; light: string } => {
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", light: "bg-blue-100" },
    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", light: "bg-purple-100" },
    { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", light: "bg-green-100" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-100" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", light: "bg-rose-100" },
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", light: "bg-indigo-100" },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", light: "bg-cyan-100" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", light: "bg-emerald-100" },
    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", light: "bg-orange-100" },
    { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", light: "bg-pink-100" },
  ]
  return colors[index % colors.length]
}

// Support level types and helper functions
type SupportLevel = "high" | "medium" | "low"

const getSupportLevelInfo = (level: SupportLevel) => {
  switch (level) {
    case "high":
      return {
        icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
        label: "High",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        description: "Strong evidence from multiple respondents consistently confirms this hypothesis.",
      }
    case "medium":
      return {
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        label: "Medium",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        description:
          "Mixed evidence with some respondents confirming aspects of this hypothesis while others contradict it.",
      }
    case "low":
      return {
        icon: <XCircle className="h-5 w-5 text-gray-500" />,
        label: "Low",
        color: "text-gray-700 bg-gray-50 border-gray-200",
        description:
          "Limited evidence supporting this hypothesis, with most respondents providing contradictory information.",
      }
  }
}

// Market intelligence categories
type MarketCategory = "urgency" | "opportunity" | "benchmark" | "trend"

const getMarketCategoryInfo = (category: MarketCategory) => {
  switch (category) {
    case "urgency":
      return {
        icon: <Clock className="h-4 w-4 text-rose-600" />,
        label: "Market Urgency",
        color: "text-rose-700",
      }
    case "opportunity":
      return {
        icon: <LineChart className="h-4 w-4 text-emerald-600" />,
        label: "Opportunity Sizing",
        color: "text-emerald-700",
      }
    case "benchmark":
      return {
        icon: <Users className="h-4 w-4 text-blue-600" />,
        label: "Competitive Benchmark",
        color: "text-blue-700",
      }
    case "trend":
      return {
        icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
        label: "Emerging Trend",
        color: "text-purple-600",
      }
  }
}

// Predefined tags
const predefinedTags: Tag[] = [
  { id: "painPoint", name: "PainPoint", color: "bg-red-100 text-red-800 border-red-200" },
  { id: "feedback", name: "Feedback", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "bugReport", name: "BugReport", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { id: "feature", name: "Feature", color: "bg-green-100 text-green-800 border-green-200" },
  { id: "insight", name: "Insight", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "quote", name: "Quote", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { id: "priority", name: "Priority", color: "bg-rose-100 text-rose-800 border-rose-200" },
  { id: "positive", name: "Positive", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { id: "negative", name: "Negative", color: "bg-gray-100 text-gray-800 border-gray-200" },
]

// Helper component for the Plus icon
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

// Custom tag creation component
function TagCreator({ onCreateTag }: { onCreateTag: (tagName: string) => void }) {
  const [tagInput, setTagInput] = useState("")
  const [tagColor, setTagColor] = useState("bg-blue-100 text-blue-800 border-blue-200")

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800 border-blue-200", label: "Blue" },
    { value: "bg-green-100 text-green-800 border-green-200", label: "Green" },
    { value: "bg-purple-100 text-purple-800 border-purple-200", label: "Purple" },
    { value: "bg-amber-100 text-amber-800 border-amber-200", label: "Amber" },
    { value: "bg-rose-100 text-rose-800 border-rose-200", label: "Rose" },
    { value: "bg-cyan-100 text-cyan-800 border-cyan-200", label: "Cyan" },
    { value: "bg-indigo-100 text-indigo-800 border-indigo-200", label: "Indigo" },
  ]

  const handleCreateTag = () => {
    if (tagInput.trim()) {
      onCreateTag(tagInput.trim())
      setTagInput("")
    }
  }

  return (
    <div className="space-y-3 p-1">
      <div className="flex flex-col gap-2">
        <label htmlFor="tag-name" className="text-xs font-medium text-gray-700">
          Tag Name
        </label>
        <Input
          id="tag-name"
          placeholder="Enter tag name..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          className="text-sm h-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTag()
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-700">Tag Color</label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((color) => (
            <div
              key={color.value}
              className={`p-1 rounded-md cursor-pointer border-2 ${
                tagColor === color.value ? "border-gray-900" : "border-transparent"
              }`}
              onClick={() => setTagColor(color.value)}
            >
              <div className={`${color.value} rounded-md p-2 text-center text-xs`}>{color.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Preview:</span>
          <Badge className={`${tagColor} border`}>#{tagInput || "Tag"}</Badge>
        </div>
      </div>

      <Button className="w-full mt-2" size="sm" onClick={handleCreateTag} disabled={!tagInput.trim()}>
        Create Tag
      </Button>
    </div>
  )
}

export default function InsightsPage({
  problemStatement,
  hypotheses,
  questions,
  respondents,
  onPremiumModalOpen = () => {},
}: InsightsPageProps) {
  const [expandedHypothesis, setExpandedHypothesis] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [expandedResponses, setExpandedResponses] = useState<{ [key: string]: boolean }>({})
  const [expandedHypothesisCells, setExpandedHypothesisCells] = useState<{ [key: string]: string | null }>({})
  const [customTags, setCustomTags] = useState<Tag[]>([])
  const [newTagInput, setNewTagInput] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [columnOrder, setColumnOrder] = useState(["respondent", "question", "response", "hypothesis"])
  const [columnWidths, setColumnWidths] = useState({
    respondent: 18,
    question: 25,
    response: 42,
    hypothesis: 15,
  })
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startResizeX, setStartResizeX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const tableRef = useRef<HTMLTableElement>(null)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)

  // Enhanced state for multi-select filters
  const [selectedRespondents, setSelectedRespondents] = useState<string[]>([])
  const [selectedHypotheses, setSelectedHypotheses] = useState<string[]>([])

  // Smart Insights Table state
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortColumn, setSortColumn] = useState<string>("respondent")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // State for response data with tags and highlights
  const [responseData, setResponseData] = useState<{
    [key: string]: {
      tags: string[]
      highlights: { text: string; startIndex: number; endIndex: number }[]
    }
  }>({})

  // Initialize response data
  useEffect(() => {
    const initialData: {
      [key: string]: {
        tags: string[]
        highlights: { text: string; startIndex: number; endIndex: number }[]
      }
    } = {}

    respondents.forEach((respondent) => {
      respondent.responses.forEach((response) => {
        const key = `${respondent.id}-${response.questionId}`
        initialData[key] = {
          tags: response.tags || [],
          highlights: response.highlights || [],
        }
      })
    })

    setResponseData(initialData)
  }, [respondents])

  // Handle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const tableTop = tableRef.current.getBoundingClientRect().top
        setIsHeaderSticky(tableTop <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Handle column drag start
  const handleColumnDragStart = (column: string) => {
    setDraggedColumn(column)
  }

  // Handle column drag over
  const handleColumnDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault()
    if (draggedColumn && draggedColumn !== column) {
      const newOrder = [...columnOrder]
      const draggedIndex = newOrder.indexOf(draggedColumn)
      const targetIndex = newOrder.indexOf(column)

      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedColumn)

      setColumnOrder(newOrder)
    }
  }

  // Handle column drag end
  const handleColumnDragEnd = () => {
    setDraggedColumn(null)
  }

  // Handle column resize start
  const handleResizeStart = (e: React.MouseEvent, column: string) => {
    e.preventDefault()
    setResizingColumn(column)
    setStartResizeX(e.clientX)
    setStartWidth(columnWidths[column as keyof typeof columnWidths])
  }

  // Handle column resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - startResizeX
        const newWidth = Math.max(10, startWidth + diff / 10) // Convert pixels to percentage

        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: newWidth,
        }))
      }
    },
    [resizingColumn, startResizeX, startWidth],
  )

  // Handle column resize end
  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null)
  }, [])

  // Add resize event listeners
  useEffect(() => {
    if (resizingColumn) {
      window.addEventListener("mousemove", handleResizeMove)
      window.addEventListener("mouseup", handleResizeEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove)
      window.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd])

  // Toggle response expansion
  const toggleResponseExpansion = (responseKey: string) => {
    setExpandedResponses((prev) => ({
      ...prev,
      [responseKey]: !prev[responseKey],
    }))
  }

  // Toggle hypothesis cell expansion
  const toggleHypothesisCell = (cellKey: string, hypothesisId: string) => {
    setExpandedHypothesisCells((prev) => ({
      ...prev,
      [cellKey]: prev[cellKey] === hypothesisId ? null : hypothesisId,
    }))
  }

  // Add tag to response
  const addTagToResponse = (responseKey: string, tagId: string) => {
    setResponseData((prev) => {
      const current = prev[responseKey] || { tags: [], highlights: [] }

      // Only add if not already present
      if (!current.tags.includes(tagId)) {
        return {
          ...prev,
          [responseKey]: {
            ...current,
            tags: [...current.tags, tagId],
          },
        }
      }

      return prev
    })
  }

  // Remove tag from response
  const removeTagFromResponse = (responseKey: string, tagId: string) => {
    setResponseData((prev) => {
      const current = prev[responseKey] || { tags: [], highlights: [] }

      return {
        ...prev,
        [responseKey]: {
          ...current,
          tags: current.tags.filter((id) => id !== tagId),
        },
      }
    })
  }

  // Add highlight to response
  const addHighlightToResponse = (responseKey: string, startIndex: number, endIndex: number, text: string) => {
    setResponseData((prev) => {
      const current = prev[responseKey] || { tags: [], highlights: [] }

      return {
        ...prev,
        [responseKey]: {
          ...current,
          highlights: [...current.highlights, { startIndex, endIndex, text }],
        },
      }
    })
  }

  // Remove highlight from response
  const removeHighlightFromResponse = (responseKey: string, index: number) => {
    setResponseData((prev) => {
      const current = prev[responseKey] || { tags: [], highlights: [] }

      return {
        ...prev,
        [responseKey]: {
          ...current,
          highlights: current.highlights.filter((_, i) => i !== index),
        },
      }
    })
  }

  // Add custom tag with color
  const addCustomTag = (name: string, color?: string) => {
    if (name.trim()) {
      const tagId = name.trim().toLowerCase().replace(/\s+/g, "")

      // Check if tag already exists
      if ([...predefinedTags, ...customTags].some((tag) => tag.id === tagId)) {
        return tagId
      }

      // Use provided color or generate random color
      const tagColor =
        color ||
        (() => {
          const colors = [
            "bg-blue-100 text-blue-800 border-blue-200",
            "bg-green-100 text-green-800 border-green-200",
            "bg-purple-100 text-purple-800 border-purple-200",
            "bg-amber-100 text-amber-800 border-amber-200",
            "bg-rose-100 text-rose-800 border-rose-200",
            "bg-cyan-100 text-cyan-800 border-cyan-200",
            "bg-indigo-100 text-indigo-800 border-indigo-200",
          ]
          return colors[Math.floor(Math.random() * colors.length)]
        })()

      setCustomTags((prev) => [...prev, { id: tagId, name: name.trim(), color: tagColor }])

      return tagId
    }
    return null
  }

  // Handle tag filter change
  const handleTagFilterChange = (tagId: string) => {
    setTagFilter((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  // Handle multi-select respondent filter change
  const handleRespondentFilterChange = (respondentId: string) => {
    setSelectedRespondents((prev) =>
      prev.includes(respondentId) ? prev.filter((id) => id !== respondentId) : [...prev, respondentId],
    )
  }

  // Handle multi-select hypothesis filter change
  const handleHypothesisFilterChange = (hypothesisId: string) => {
    setSelectedHypotheses((prev) =>
      prev.includes(hypothesisId) ? prev.filter((id) => id !== hypothesisId) : [...prev, hypothesisId],
    )
  }

  // Export to CSV
  const exportToCSV = () => {
    // Get visible data
    const data = filteredAndSortedData

    // Create CSV content
    let csvContent = "Respondent,Question,Response,Linked Hypotheses,Tags\n"

    data.forEach((item) => {
      const responseKey = `${item.respondent.id}-${item.response.questionId}`
      const responseTags = responseData[responseKey]?.tags || []
      const tagNames = responseTags
        .map((tagId) => {
          const tag = [...predefinedTags, ...customTags].find((t) => t.id === tagId)
          return tag ? tag.name : ""
        })
        .join("; ")

      const hypothesisLabels = item.linkedHypotheses
        .map((h, i) => `H${hypotheses.findIndex((hyp) => hyp.id === h.id) + 1}`)
        .join("; ")

      // Escape quotes in text fields
      const escapedResponse = item.response.answer.replace(/"/g, '""')
      const escapedQuestion = item.question.title.replace(/"/g, '""')

      csvContent += `"${item.respondent.name}","${escapedQuestion}","${escapedResponse}","${hypothesisLabels}","${tagNames}"\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "smart_insights.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter and sort data for Smart Insights Table
  const filteredAndSortedData = useMemo(() => {
    // Start with all responses from all respondents
    let data = respondents
      .flatMap((respondent) =>
        respondent.responses.map((response) => {
          const question = questions.find((q) => q.id === response.questionId)
          if (!question) return null

          // Find linked hypotheses for this question
          const linkedHypothesisIds = question.hypothesisIds || []
          const linkedHypotheses = hypotheses.filter((h) => linkedHypothesisIds.includes(h.id))

          return {
            respondent,
            question,
            response,
            linkedHypotheses,
          }
        }),
      )
      .filter(Boolean) as Array<{
      respondent: Respondent
      question: Question
      response: Response
      linkedHypotheses: Hypothesis[]
    }>

    // Apply respondent filter (multi-select)
    if (selectedRespondents.length > 0) {
      data = data.filter((item) => selectedRespondents.includes(item.respondent.id))
    }

    // Apply hypothesis filter (multi-select)
    if (selectedHypotheses.length > 0) {
      data = data.filter((item) => item.linkedHypotheses.some((h) => selectedHypotheses.includes(h.id)))
    }

    // Apply tag filter
    if (tagFilter.length > 0) {
      data = data.filter((item) => {
        const responseKey = `${item.respondent.id}-${item.response.questionId}`
        const responseTags = responseData[responseKey]?.tags || []
        return tagFilter.some((tagId) => responseTags.includes(tagId))
      })
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.respondent.name.toLowerCase().includes(query) ||
          item.question.title.toLowerCase().includes(query) ||
          item.response.answer.toLowerCase().includes(query) ||
          item.response.followUps.some(
            (followUp) =>
              followUp.question.toLowerCase().includes(query) || followUp.answer.toLowerCase().includes(query),
          ),
      )
    }

    // Sort data
    data.sort((a, b) => {
      let valueA, valueB

      switch (sortColumn) {
        case "respondent":
          valueA = a.respondent.name
          valueB = b.respondent.name
          break
        case "question":
          valueA = a.question.title
          valueB = b.question.title
          break
        case "hypothesis":
          valueA = a.linkedHypotheses.length > 0 ? hypotheses.findIndex((h) => h.id === a.linkedHypotheses[0].id) : 999
          valueB = b.linkedHypotheses.length > 0 ? hypotheses.findIndex((h) => h.id === b.linkedHypotheses[0].id) : 999
          break
        default:
          valueA = a.respondent.name
          valueB = b.respondent.name
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return data
  }, [
    respondents,
    questions,
    hypotheses,
    selectedRespondents,
    selectedHypotheses,
    searchQuery,
    sortColumn,
    sortDirection,
    tagFilter,
    responseData,
  ])

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "marketIntelligence") {
      onPremiumModalOpen()
      // Don't actually change the tab
    } else {
      setActiveTab(value)
    }
  }

  // Handle premium modal close
  const handlePremiumModalClose = () => {
    setShowPremiumModal(false)
    // We don't need to switch tabs since we never actually changed to marketIntelligence
  }

  // Toggle hypothesis expansion
  const toggleHypothesis = (id: string) => {
    setExpandedHypothesis(expandedHypothesis === id ? null : id)
  }

  // Toggle question expansion
  const toggleQuestion = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id)
  }

  // Get all responses for a specific question
  const getResponsesForQuestion = (questionId: string) => {
    return respondents
      .map((respondent) => {
        const response = respondent.responses.find((r) => r.questionId === questionId)
        if (response) {
          return {
            respondentName: respondent.name,
            respondentId: respondent.id,
            answer: response.answer,
            followUps: response.followUps,
          }
        }
        return null
      })
      .filter(Boolean)
  }

  // Get questions for a specific hypothesis
  const getQuestionsForHypothesis = (hypothesisId: string) => {
    return questions.filter((q) => q.hypothesisIds?.includes(hypothesisId))
  }

  // Generate a key insight based on the problem statement and responses
  const generateKeyInsight = () => {
    // In a real application, this would be AI-generated or calculated from actual data
    return "User engagement dropped primarily due to usability issues in the new dashboard layout and lack of feature parity in the mobile app."
  }

  // Generate hypothesis insights
  const generateHypothesisInsight = (hypothesisId: string) => {
    // In a real application, this would be AI-generated or calculated from actual data
    if (hypothesisId === "h1") {
      return "The data strongly supports this hypothesis. 78% of respondents mentioned difficulty finding information in the new dashboard layout."
    } else if (hypothesisId === "h2") {
      return "This hypothesis is partially supported. While mobile users report frustration, the primary issue appears to be app stability rather than feature parity."
    }
    return "Insufficient data to evaluate this hypothesis."
  }

  // Generate question insights
  const generateQuestionInsight = (questionId: string) => {
    // In a real application, this would be AI-generated or calculated from actual data
    if (questionId === "1") {
      return "Dashboard analytics and mobile app stability are the most requested improvements, with 65% of respondents mentioning one or both."
    } else if (questionId === "2") {
      return "Customer support receives mixed feedback - response time is praised, but lack of account history access is a common pain point."
    }
    return "No clear pattern identified in responses."
  }

  // Create a map of hypothesis colors for easy access
  const hypothesisColorMap = hypotheses.reduce(
    (acc, h, i) => {
      acc[h.id] = getHypothesisColor(i)
      return acc
    },
    {} as Record<string, { bg: string; text: string; border: string; light: string }>,
  )

  // Sample data for the redesigned insights
  const keyInsights = [
    {
      title: "User Experience Friction Points",
      subtitle: "Users are experiencing significant friction in core workflows",
      primaryInsight: {
        bullets: [
          "78% of respondents reported difficulty navigating the dashboard interface",
          "65% specifically mentioned confusion finding analytics data and recent activity",
          'Users consistently described the experience as "overwhelming" and "cluttered"',
        ],
        source: "Based on analysis of 12 respondent interviews",
      },
      marketIntelligence: [
        {
          category: "urgency" as MarketCategory,
          text: "Addressing UX friction is urgent as it directly impacts core user retention metrics",
          source: "Customer Success Metrics Q1 2023",
        },
        {
          category: "opportunity" as MarketCategory,
          text: "Improving dashboard UX can boost engagement by ~35% based on similar implementations",
          source: "UX Impact Analysis Report",
        },
        {
          category: "benchmark" as MarketCategory,
          text: "Leading platforms limit dashboard metrics to 5-7 per view with progressive disclosure",
          source: "Nielsen Norman Group",
        },
        {
          category: "trend" as MarketCategory,
          text: "Industry shift toward contextual, personalized dashboards is accelerating",
          source: "Forrester SaaS UX Trends 2023",
        },
      ],
      recommendedAction:
        "Prioritize dashboard redesign focused on information clarity and progressive disclosure patterns",
    },
    {
      title: "Mobile App Limitations",
      subtitle: "Mobile users face significant feature disparity compared to desktop",
      primaryInsight: {
        bullets: [
          "65% of mobile users expressed frustration with limited mobile functionality",
          "42% specifically cited inability to access advanced analytics on mobile",
          "38% mentioned approval workflows being unavailable, causing task delays",
        ],
        source: "Based on analysis of 8 respondent interviews from mobile users",
      },
      marketIntelligence: [
        {
          category: "urgency" as MarketCategory,
          text: "Mobile usage in B2B SaaS has increased by 43% in the past year, making this a priority",
          source: "Forrester Research",
        },
        {
          category: "opportunity" as MarketCategory,
          text: "Mobile feature parity could increase overall platform usage by 28% among existing users",
          source: "Internal Usage Analysis",
        },
        {
          category: "benchmark" as MarketCategory,
          text: "92% of leading platforms now offer full functionality on mobile devices",
          source: "SaaS Industry Report 2023",
        },
        {
          category: "trend" as MarketCategory,
          text: "B2B mobile-first strategies are becoming standard across enterprise software",
          source: "Gartner Mobile Trends",
        },
      ],
      recommendedAction:
        "Prioritize mobile feature parity in the product roadmap, starting with analytics and approval workflows",
    },
    {
      title: "Onboarding Experience Gaps",
      subtitle: "New users struggle to achieve early success with the platform",
      primaryInsight: {
        bullets: [
          'New users spend 47 minutes on average during initial setup (83% report feeling "overwhelmed")',
          "Data import and integration setup were identified as the most confusing areas",
          "Users who don't complete setup within one session are 3x more likely to abandon",
        ],
        source: "Based on analysis of 6 recent user interviews and onboarding analytics",
      },
      marketIntelligence: [
        {
          category: "urgency" as MarketCategory,
          text: "First-time user experience directly impacts conversion rates and is an immediate priority",
          source: "User Activation Metrics",
        },
        {
          category: "opportunity" as MarketCategory,
          text: "Optimized onboarding could reduce churn by 40% in the first 30 days of usage",
          source: "Customer Success Analysis",
        },
        {
          category: "benchmark" as MarketCategory,
          text: "Top SaaS platforms achieve meaningful outcomes within 15 minutes of first login",
          source: "Appcues Benchmark Report",
        },
        {
          category: "trend" as MarketCategory,
          text: "Contextual, milestone-based onboarding is replacing comprehensive tutorials",
          source: "UserOnboard.com",
        },
      ],
      recommendedAction:
        "Redesign the onboarding flow to focus on quick wins and progressive learning with a 15-minute success milestone",
    },
  ]

  // Sample hypothesis data with support levels
  const hypothesisData = hypotheses.map((hypothesis, index) => {
    // Randomly assign support level for demo purposes
    const supportLevelValue = Math.random()
    const supportLevel: SupportLevel = supportLevelValue > 0.7 ? "high" : supportLevelValue > 0.4 ? "medium" : "low"

    // Generate key insights based on support level
    const keyInsights = [
      supportLevel === "high"
        ? "Users consistently reported difficulties with the specific feature mentioned in the hypothesis"
        : supportLevel === "medium"
          ? "Some users experienced issues with the feature, but context and severity varied"
          : "Users rarely mentioned this issue, suggesting it may not be a primary concern",
      supportLevel === "high"
        ? "The impact on user experience is significant, affecting core workflows"
        : supportLevel === "medium"
          ? "The impact appears limited to specific user segments or use cases"
          : "Other issues were mentioned more frequently and with greater concern",
    ]

    // Generate recommendation based on support level
    const recommendation =
      supportLevel === "high"
        ? `Refined H${index + 1}: ${hypothesis.text} with a focus on improving the specific user workflow identified`
        : supportLevel === "medium"
          ? `Modified H${index + 1}: A more nuanced version of "${hypothesis.text}" that accounts for the varying user contexts`
          : `New hypothesis: Consider replacing "${hypothesis.text}" with a focus on the issues users actually reported`

    return {
      ...hypothesis,
      supportLevel,
      keyInsights,
      recommendation,
    }
  })

  // Render highlighted text
  const renderHighlightedText = (
    text: string,
    highlights: { text: string; startIndex: number; endIndex: number }[],
  ) => {
    if (!highlights || highlights.length === 0) return text

    let lastIndex = 0
    const parts: JSX.Element[] = []

    // Sort highlights by startIndex
    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex)

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.startIndex > lastIndex) {
        parts.push(<span key={`text-${index}`}>{text.substring(lastIndex, highlight.startIndex)}</span>)
      }

      // Add highlighted text
      parts.push(
        <span key={`highlight-${index}`} className="bg-yellow-200 px-0.5 rounded">
          {text.substring(highlight.startIndex, highlight.endIndex)}
        </span>,
      )

      lastIndex = highlight.endIndex
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>)
    }

    return <>{parts}</>
  }

  // Get all available tags
  const allTags = [...predefinedTags, ...customTags]

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="pt-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="summary" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex w-full max-w-xl justify-start gap-1 border-none shadow-none bg-transparent p-0">
              <TabsTrigger
                value="summary"
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger
                value="smartInsights"
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart className="h-4 w-4" />
                <span>Smart Table</span>
              </TabsTrigger>
              <TabsTrigger
                value="marketIntelligence"
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                onClick={onPremiumModalOpen}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  Market Intelligence{" "}
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PRO</span>{" "}
                  <Lock className="h-3 w-3 text-amber-500" />
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto py-6">
        <div className="max-w-5xl mx-auto">
          {activeTab === "summary" && (
            <div className="space-y-8">
              {/* Summary Stats - Moved to top */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Total Respondents</p>
                      <p className="text-3xl font-bold">{respondents.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Questions Asked</p>
                      <p className="text-3xl font-bold">{questions.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Hypotheses Tested</p>
                      <p className="text-3xl font-bold">{hypotheses.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top-level Insight (Hero Section) - Simplified */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
                <div className="px-8 py-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{generateKeyInsight()}</h2>
                  <p className="text-gray-700 text-lg">
                    This directly addresses the problem statement:{" "}
                    <span className="font-medium">"{problemStatement}"</span>
                  </p>
                </div>
                <div className="px-8 py-3 bg-gray-50 border-t border-gray-200 flex items-center gap-2 text-gray-600">
                  <Info className="h-4 w-4" />
                  <p className="text-sm">
                    Based on {respondents.length} respondent interviews and analysis of {questions.length} questions
                    across {hypotheses.length} hypotheses
                  </p>
                </div>
              </div>

              {/* Key Insights & Recommended Actions */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Key Insights & Recommended Actions
                </h2>

                <div className="space-y-8">
                  {keyInsights.map((insight, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                      <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-bold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{insight.subtitle}</p>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Primary Insight */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              Primary Insight
                            </h4>
                            <ul className="space-y-3">
                              {insight.primaryInsight.bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-600 font-bold">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-gray-500 italic">{insight.primaryInsight.source}</p>
                          </div>

                          {/* Market Intelligence */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                              Market Intelligence
                            </h4>
                            <ul className="space-y-3">
                              {insight.marketIntelligence.map((item, i) => {
                                const category = getMarketCategoryInfo(item.category)
                                return (
                                  <li key={i} className="flex gap-2">
                                    <div className="mt-0.5">{category.icon}</div>
                                    <div>
                                      <span className={`text-xs font-medium ${category.color} block mb-0.5`}>
                                        {category.label}
                                      </span>
                                      <span>{item.text}</span>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button className="ml-1 inline-flex items-center">
                                              <Info className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Source: {item.source}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        </div>

                        {/* Recommended Action */}
                        <div className="mt-6 pt-5 border-t">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              Recommendation
                            </h4>
                            <p className="text-gray-800">{insight.recommendedAction}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hypothesis Testing */}
              <div>
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  Hypothesis Testing
                </h2>

                <div className="space-y-6">
                  {hypothesisData.map((hypothesis, index) => {
                    const supportInfo = getSupportLevelInfo(hypothesis.supportLevel)

                    return (
                      <div key={hypothesis.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                              <span>H{index + 1}: </span>
                              {hypothesis.text}
                            </h3>
                            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${supportInfo.color}`}>
                              {supportInfo.icon}
                              <span className="font-medium">{supportInfo.label} Support</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{supportInfo.description}</p>
                        </div>

                        <div className="p-6 space-y-5">
                          {/* Key Insights */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Key Insights:</h4>
                            <ul className="space-y-2">
                              {hypothesis.keyInsights.map((insight, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-600 font-bold">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommendation */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              Recommendation
                            </h4>
                            <p className="text-gray-800">{hypothesis.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "smartInsights" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Enhanced Filters & Actions Bar */}
                <div className="p-4 border-b bg-gray-50 space-y-4">
                  {/* Search and Actions Row */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Search responses, questions, or respondents..."
                        className="pl-9 pr-4 py-2 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-10" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-1" />
                        <span>Export CSV</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-wrap gap-3">
                    {/* Respondent Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {selectedRespondents.length === 0
                              ? "All Respondents"
                              : selectedRespondents.length === 1
                                ? "1 Respondent"
                                : `${selectedRespondents.length} Respondents`}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          <div
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => setSelectedRespondents([])}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox id="select-all-respondents" checked={selectedRespondents.length === 0} />
                              <label htmlFor="select-all-respondents" className="text-sm font-medium cursor-pointer">
                                All Respondents
                              </label>
                            </div>
                          </div>
                          {respondents.map((respondent) => (
                            <div
                              key={respondent.id}
                              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                              onClick={() => handleRespondentFilterChange(respondent.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`respondent-${respondent.id}`}
                                  checked={selectedRespondents.includes(respondent.id)}
                                />
                                <label htmlFor={`respondent-${respondent.id}`} className="text-sm cursor-pointer">
                                  {respondent.name}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Hypothesis Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Lightbulb className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {selectedHypotheses.length === 0
                              ? "All Hypotheses"
                              : selectedHypotheses.length === 1
                                ? "1 Hypothesis"
                                : `${selectedHypotheses.length} Hypotheses`}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          <div
                            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => setSelectedHypotheses([])}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox id="select-all-hypotheses" checked={selectedHypotheses.length === 0} />
                              <label htmlFor="select-all-hypotheses" className="text-sm font-medium cursor-pointer">
                                All Hypotheses
                              </label>
                            </div>
                          </div>
                          {hypotheses.map((hypothesis, index) => (
                            <div
                              key={hypothesis.id}
                              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                              onClick={() => handleHypothesisFilterChange(hypothesis.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`hypothesis-${hypothesis.id}`}
                                  checked={selectedHypotheses.includes(hypothesis.id)}
                                />
                                <label htmlFor={`hypothesis-${hypothesis.id}`} className="text-sm cursor-pointer">
                                  H{index + 1}: {hypothesis.text.substring(0, 30)}
                                  {hypothesis.text.length > 30 ? "..." : ""}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Active Filters Display */}
                    {(selectedRespondents.length > 0 || selectedHypotheses.length > 0) && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-gray-500"
                          onClick={() => {
                            setSelectedRespondents([])
                            setSelectedHypotheses([])
                            setSearchQuery("")
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Table */}
                <div className="overflow-x-auto">
                  <table ref={tableRef} className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                    <thead className={cn("bg-gray-50 border-b sticky top-0 z-10", isHeaderSticky && "shadow-sm")}>
                      <tr>
                        {columnOrder.map((column) => (
                          <th
                            key={column}
                            className={`text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 relative`}
                            style={{ width: `${columnWidths[column as keyof typeof columnWidths]}%` }}
                            draggable
                            onDragStart={() => handleColumnDragStart(column)}
                            onDragOver={(e) => handleColumnDragOver(e, column)}
                            onDragEnd={handleColumnDragEnd}
                          >
                            <div className="flex items-center gap-1 px-4 py-3">
                              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                              <div className="flex items-center gap-1 flex-1" onClick={() => handleSort(column)}>
                                <span className="capitalize">{column}</span>
                                {sortColumn === column &&
                                  (sortDirection === "asc" ? (
                                    <ArrowUp className="h-3 w-3" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3" />
                                  ))}
                              </div>
                            </div>
                            <div
                              className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 hover:w-1"
                              onMouseDown={(e) => handleResizeStart(e, column)}
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedData.map((item, index) => {
                        const responseKey = `${item.respondent.id}-${item.response.questionId}`
                        const isExpanded = expandedResponses[responseKey] || false
                        const cellKey = `${item.respondent.id}-${item.response.questionId}-hyp`

                        // Get tags for this response
                        const responseTags = responseData[responseKey]?.tags || []
                        const responseHighlights = responseData[responseKey]?.highlights || []

                        return (
                          <tr
                            key={responseKey}
                            className={cn(
                              "border-b transition-colors",
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                              "hover:bg-gray-100/50",
                            )}
                          >
                            {columnOrder.map((column) => {
                              if (column === "respondent") {
                                return (
                                  <td
                                    key={column}
                                    className="px-4 py-4 text-sm text-gray-900 align-top"
                                    style={{ width: `${columnWidths[column as keyof typeof columnWidths]}%` }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                      <span>{item.respondent.name}</span>
                                    </div>
                                  </td>
                                )
                              }

                              if (column === "question") {
                                return (
                                  <td
                                    key={column}
                                    className="px-4 py-4 text-sm text-gray-900 align-top"
                                    style={{ width: `${columnWidths[column as keyof typeof columnWidths]}%` }}
                                  >
                                    {item.question.title}
                                  </td>
                                )
                              }

                              if (column === "response") {
                                return (
                                  <td
                                    key={column}
                                    className="px-4 py-4 text-sm text-gray-900 align-top cursor-pointer"
                                    style={{ width: `${columnWidths[column as keyof typeof columnWidths]}%` }}
                                    onClick={() => toggleResponseExpansion(responseKey)}
                                  >
                                    <div>
                                      {/* Response tags */}
                                      {responseTags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {responseTags.map((tagId) => {
                                            const tag = allTags.find((t) => t.id === tagId)
                                            if (!tag) return null

                                            return (
                                              <Badge
                                                key={tagId}
                                                className={`${tag.color} border text-xs`}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleTagFilterChange(tagId)
                                                }}
                                              >
                                                #{tag.name}
                                                <button
                                                  className="ml-1 hover:bg-gray-200/50 rounded-full p-0.5"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeTagFromResponse(responseKey, tagId)
                                                  }}
                                                >
                                                  <X className="h-2 w-2" />
                                                </button>
                                              </Badge>
                                            )
                                          })}

                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-5 w-5 p-0 rounded-full"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <PlusIcon className="h-3 w-3" />
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
                                              <Tabs defaultValue="existing">
                                                <TabsList className="grid w-full grid-cols-2 mb-2">
                                                  <TabsTrigger value="existing">Existing Tags</TabsTrigger>
                                                  <TabsTrigger value="create">Create New</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="existing">
                                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {allTags.map((tag) => (
                                                      <div
                                                        key={tag.id}
                                                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                                        onClick={() => addTagToResponse(responseKey, tag.id)}
                                                      >
                                                        <Badge className={`${tag.color} border`}>#{tag.name}</Badge>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </TabsContent>
                                                <TabsContent value="create">
                                                  <TagCreator
                                                    onCreateTag={(tagName) => {
                                                      const tagId = addCustomTag(tagName)
                                                      if (tagId) {
                                                        addTagToResponse(responseKey, tagId)
                                                      }
                                                    }}
                                                  />
                                                </TabsContent>
                                              </Tabs>
                                            </PopoverContent>
                                          </Popover>
                                        </div>
                                      )}

                                      {/* Response text with highlights */}
                                      <div className={cn("relative", !isExpanded && "line-clamp-2")}>
                                        {renderHighlightedText(item.response.answer, responseHighlights)}

                                        {!isExpanded && (
                                          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                        )}
                                      </div>

                                      {/* Expand/collapse button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleResponseExpansion(responseKey)
                                        }}
                                        className="text-blue-600 text-xs mt-1 hover:underline flex items-center gap-1"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp className="h-3 w-3" />
                                            Show less
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="h-3 w-3" />
                                            Show more
                                          </>
                                        )}
                                      </button>

                                      {/* Follow-up questions */}
                                      {isExpanded && item.response.followUps.length > 0 && (
                                        <div className="mt-3 space-y-3 pl-3 border-l-2 border-gray-200 bg-gray-50 p-2 rounded-md">
                                          {item.response.followUps.map((followUp, fIndex) => (
                                            <div key={fIndex} className="text-xs">
                                              <p className="text-gray-600 mb-1 font-medium">
                                                <MessageSquare className="h-3 w-3 inline mr-1" />
                                                {followUp.question}
                                              </p>
                                              <p className="text-gray-800">{followUp.answer}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                )
                              }

                              if (column === "hypothesis") {
                                return (
                                  <td
                                    key={column}
                                    className="px-4 py-4 text-sm align-top"
                                    style={{ width: `${columnWidths[column as keyof typeof columnWidths]}%` }}
                                  >
                                    <div className="flex flex-col gap-2">
                                      {item.linkedHypotheses.length > 0 ? (
                                        <div className="space-y-2">
                                          {item.linkedHypotheses.map((hypothesis) => {
                                            const hypothesisIndex = hypotheses.findIndex((h) => h.id === hypothesis.id)
                                            const color = getHypothesisColor(hypothesisIndex)
                                            const isExpanded = expandedHypothesisCells[cellKey] === hypothesis.id

                                            return (
                                              <div key={hypothesis.id}>
                                                {isExpanded ? (
                                                  // Expanded view with full hypothesis text
                                                  <div
                                                    className={`p-3 rounded-md ${color.bg} ${color.text} border ${color.border} cursor-pointer`}
                                                    onClick={() => toggleHypothesisCell(cellKey, hypothesis.id)}
                                                  >
                                                    <div className="font-bold">
                                                      H{hypothesisIndex + 1}: {hypothesis.text}
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                      <button className="text-xs flex items-center gap-1">
                                                        <ChevronUp className="h-3 w-3" />
                                                        Show less
                                                      </button>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  // Collapsed view with just badge
                                                  <div
                                                    className={`p-2 rounded-md ${color.bg} ${color.text} border ${color.border} cursor-pointer`}
                                                    onClick={() => toggleHypothesisCell(cellKey, hypothesis.id)}
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <div className="font-bold truncate">H{hypothesisIndex + 1}</div>
                                                      <ChevronDown className="h-3 w-3 flex-shrink-0" />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          })}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400 text-xs">None</span>
                                      )}
                                    </div>
                                  </td>
                                )
                              }

                              return <td key={column}></td>
                            })}
                          </tr>
                        )
                      })}
                      {filteredAndSortedData.length === 0 && (
                        <tr>
                          <td colSpan={columnOrder.length} className="px-4 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <Filter className="h-8 w-8 text-gray-400" />
                              <p>No results match your filters</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRespondents([])
                                  setSelectedHypotheses([])
                                  setSearchQuery("")
                                }}
                              >
                                Clear filters
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Premium Feature Modal */}
          <PremiumFeatureModal
            isOpen={showPremiumModal}
            onClose={handlePremiumModalClose}
            featureName="Market Intelligence"
          />
        </div>
      </div>
    </div>
  )
}
