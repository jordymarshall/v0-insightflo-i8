"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, Edit, Share, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Interview type definition
type Interview = {
  id: string
  title: string
  date: string
  responseCount: number
  status: "completed" | "in-progress" | "draft"
  insightScore: number
  type: string
  description?: string
}

export default function InterviewInsights() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // TODO[backend]: Fetch interview data from API
  const interviews: Interview[] = [
    {
      id: "1",
      title: "Product Feedback Survey",
      date: "2023-04-15",
      responseCount: 42,
      status: "completed",
      insightScore: 87,
      type: "Customer Research",
      description: "Gathering feedback on our latest product features",
    },
    {
      id: "2",
      title: "User Experience Evaluation",
      date: "2023-04-10",
      responseCount: 28,
      status: "completed",
      insightScore: 92,
      type: "UX Research",
      description: "Evaluating the usability of our new interface",
    },
    {
      id: "3",
      title: "Feature Prioritization Survey",
      date: "2023-04-20",
      responseCount: 0,
      status: "draft",
      insightScore: 0,
      type: "Product Development",
      description: "Determining which features to prioritize in the next release",
    },
    {
      id: "4",
      title: "Customer Satisfaction Follow-up",
      date: "2023-04-05",
      responseCount: 35,
      status: "completed",
      insightScore: 76,
      type: "Customer Success",
      description: "Following up with customers after support interactions",
    },
    {
      id: "5",
      title: "Market Research Survey",
      date: "2023-04-18",
      responseCount: 17,
      status: "in-progress",
      insightScore: 63,
      type: "Market Analysis",
      description: "Researching market trends and competitor offerings",
    },
  ]

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(
      (interview) =>
        (filterStatus === "all" || interview.status === filterStatus) &&
        (interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interview.type.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const handleEditInterview = (id: string) => {
    // TODO[backend]: Navigate to edit interview page
    console.log(`Edit interview ${id}`)
  }

  const handleShareInterview = (id: string) => {
    // TODO[backend]: Open share dialog or generate share link
    console.log(`Share interview ${id}`)
  }

  const handleDeleteInterview = (id: string) => {
    // TODO[backend]: Delete interview
    console.log(`Delete interview ${id}`)
  }

  const getStatusColor = (status: Interview["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    // Replace hyphens with spaces and capitalize each word
    const words = status.replace("-", " ").split(" ")
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4 px-0">
        <CardTitle>Your Workflows</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[200px] border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px] border-gray-200">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              aria-label={`Sort by date ${sortOrder === "asc" ? "descending" : "ascending"}`}
              className="border-gray-200"
            >
              {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No workflows found. Try adjusting your filters.</div>
          ) : (
            filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md relative group"
              >
                <Link
                  href={`/workflows/${interview.id}`}
                  className="block p-4"
                  aria-label={`View details for ${interview.title}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between relative">
                    <div className="flex flex-col space-y-2 mb-3 sm:mb-0">
                      <div>
                        <h3 className="font-medium">{interview.title}</h3>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                        <div>
                          <span>Created: </span>
                          {new Date(interview.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span>{interview.responseCount} responses</span>
                        </div>
                        <div>
                          <Badge variant="outline" className={getStatusColor(interview.status)}>
                            {formatStatus(interview.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">Description:</span>{" "}
                          {interview.description || "No description available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditInterview(interview.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareInterview(interview.id)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteInterview(interview.id)} className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
          {filteredInterviews.length > 0 && (
            <div className="flex justify-center pt-2">
              <Link href="/interviews" className="text-[#8A3FFC] hover:underline text-sm">
                View all workflows
              </Link>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="group relative h-8 rounded-lg bg-gradient-to-r from-purple-500 via-violet-400 to-blue-400 px-4 text-sm font-medium text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 transform hover:scale-105"
            >
              <Link href="/">
                {/* Button text without underline animation */}
                <span>+ Create New Workflow</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
