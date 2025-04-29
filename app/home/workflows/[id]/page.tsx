"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AccountHeader from "@/components/account-header"

// This is a placeholder for the actual workflow detail page
export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const workflowId = params.id

  // In a real app, you would fetch the workflow data based on the ID
  // For now, we'll use placeholder data that matches the card data
  const workflowData: Record<
    string,
    { title: string; date: string; responseCount: number; type: string; status: string; description: string }
  > = {
    "1": {
      title: "Product Feedback Survey",
      date: "2023-04-15",
      responseCount: 42,
      type: "Customer Research",
      status: "completed",
      description: "Gathering feedback on our latest product features",
    },
    "2": {
      title: "User Experience Evaluation",
      date: "2023-04-10",
      responseCount: 28,
      type: "UX Research",
      status: "completed",
      description: "Evaluating the usability of our new interface",
    },
    "3": {
      title: "Feature Prioritization Survey",
      date: "2023-04-20",
      responseCount: 0,
      type: "Product Development",
      status: "draft",
      description: "Determining which features to prioritize in the next release",
    },
    "4": {
      title: "Customer Satisfaction Follow-up",
      date: "2023-04-05",
      responseCount: 35,
      type: "Customer Success",
      status: "completed",
      description: "Following up with customers after support interactions",
    },
    "5": {
      title: "Market Research Survey",
      date: "2023-04-18",
      responseCount: 17,
      type: "Market Analysis",
      status: "in-progress",
      description: "Researching market trends and competitor offerings",
    },
  }

  // Use the data from our mapping, or fall back to defaults
  const defaultWorkflow = {
    title: `Workflow ${workflowId}`,
    date: "2023-04-15",
    responseCount: 0,
    type: "Unknown",
    status: "draft",
    description: "No description available",
  }

  const workflowInfo = workflowData[workflowId] || defaultWorkflow

  // State for editable fields
  const [type, setType] = useState(workflowInfo.type)
  const [description, setDescription] = useState(workflowInfo.description)
  const [status, setStatus] = useState(workflowInfo.status)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would update the data in your backend
      // For now, we'll just simulate a successful save
      console.log("Saving changes:", { type, description, status })

      // Update localStorage to simulate persistence between pages
      const savedWorkflows = JSON.parse(localStorage.getItem("savedWorkflows") || "{}")
      savedWorkflows[workflowId] = {
        ...workflowInfo,
        type,
        description,
        status,
      }
      localStorage.setItem("savedWorkflows", JSON.stringify(savedWorkflows))

      setIsSaving(false)
      setIsSaved(true)

      // Reset the saved indicator after 3 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1000)
  }

  // Load any previously saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedWorkflows = JSON.parse(localStorage.getItem("savedWorkflows") || "{}")
      if (savedWorkflows[workflowId]) {
        const savedWorkflow = savedWorkflows[workflowId]
        setType(savedWorkflow.type)
        setDescription(savedWorkflow.description)
        setStatus(savedWorkflow.status)
      }
    } catch (error) {
      console.error("Error loading saved workflow data:", error)
    }
  }, [workflowId])

  return (
    <div className="min-h-screen bg-white">
      <AccountHeader />
      <main className="container mx-auto px-8 sm:px-12 md:px-16 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/account" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to workflows
            </Link>
          </Button>

          <h1 className="text-2xl font-bold mb-2">{workflowInfo.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            Created on {new Date(workflowInfo.date).toLocaleDateString()} • {workflowInfo.responseCount} responses
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2">
              <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Workflow Details</h2>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-1 bg-gray-100 hover:bg-gray-200 ${
                        isSaved ? "bg-[#8A3FFC] text-white hover:bg-[#8A3FFC]" : ""
                      }`}
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="type" className="text-sm font-medium text-gray-500 block mb-1">
                        Type
                      </label>
                      <Input id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full" />
                    </div>
                    <div>
                      <label htmlFor="description" className="text-sm font-medium text-gray-500 block mb-1">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="text-sm font-medium text-gray-500 block mb-1">
                        Status
                      </label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Suspense>
            </div>

            <div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full">View Insights</Button>
                  <Button variant="outline" className="w-full">
                    Edit Workflow
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
