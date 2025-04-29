"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Search, Filter, ChevronDown, ChevronUp, FileText, MoreHorizontal } from "lucide-react"
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
  duration: string
  status: "completed" | "in-progress" | "scheduled"
  interviewee: string
  type: string
}

export default function InterviewHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // TODO[backend]: Fetch interview data from API
  const interviews: Interview[] = [
    {
      id: "1",
      title: "Product Manager Interview",
      date: "2023-04-15",
      duration: "45 min",
      status: "completed",
      interviewee: "John Doe",
      type: "Technical",
    },
    {
      id: "2",
      title: "UX Designer Screening",
      date: "2023-04-10",
      duration: "30 min",
      status: "completed",
      interviewee: "Sarah Johnson",
      type: "Screening",
    },
    {
      id: "3",
      title: "Software Engineer Interview",
      date: "2023-04-20",
      duration: "60 min",
      status: "scheduled",
      interviewee: "Michael Chen",
      type: "Technical",
    },
    {
      id: "4",
      title: "Marketing Specialist Follow-up",
      date: "2023-04-05",
      duration: "25 min",
      status: "completed",
      interviewee: "Emily Wilson",
      type: "Follow-up",
    },
    {
      id: "5",
      title: "Data Analyst Assessment",
      date: "2023-04-18",
      duration: "50 min",
      status: "in-progress",
      interviewee: "David Rodriguez",
      type: "Assessment",
    },
  ]

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(
      (interview) =>
        (filterStatus === "all" || interview.status === filterStatus) &&
        (interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interview.interviewee.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const handleViewInterview = (id: string) => {
    // TODO[backend]: Navigate to interview details page
    console.log(`View interview ${id}`)
  }

  const handleExportInterview = (id: string) => {
    // TODO[backend]: Export interview data
    console.log(`Export interview ${id}`)
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
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
        <CardTitle>Interview History</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              aria-label={`Sort by date ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No interviews found. Try adjusting your filters.</div>
          ) : (
            filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col space-y-2 mb-3 sm:mb-0">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">{interview.title}</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(interview.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {interview.duration}
                    </div>
                    <div>
                      <Badge variant="outline" className={getStatusColor(interview.status)}>
                        {interview.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Interviewee:</span> {interview.interviewee}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewInterview(interview.id)}>
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExportInterview(interview.id)}>Export</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteInterview(interview.id)} className="text-red-600">
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
              <Link href="/interviews" className="text-blue-600 hover:underline text-sm">
                View all interviews
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
