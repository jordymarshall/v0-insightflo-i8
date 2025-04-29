"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type WorkflowOption = {
  id: string
  title: string
}

type ResponseData = {
  date: string
  responses: number
  completionRate: number
}

export default function ResponseChart() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("all")

  // TODO[backend]: Fetch workflow options from API
  const workflowOptions: WorkflowOption[] = [
    { id: "all", title: "All Workflows" },
    { id: "1", title: "Product Feedback Survey" },
    { id: "2", title: "User Experience Evaluation" },
    { id: "3", title: "Feature Prioritization Survey" },
    { id: "4", title: "Customer Satisfaction Follow-up" },
    { id: "5", title: "Market Research Survey" },
  ]

  // TODO[backend]: Fetch response data based on selected workflow
  const getResponseData = (workflowId: string): ResponseData[] => {
    // This would be replaced with actual API call
    if (workflowId === "1") {
      return [
        { date: "Jan 1", responses: 12, completionRate: 85 },
        { date: "Jan 8", responses: 19, completionRate: 90 },
        { date: "Jan 15", responses: 15, completionRate: 88 },
        { date: "Jan 22", responses: 25, completionRate: 92 },
        { date: "Jan 29", responses: 32, completionRate: 95 },
        { date: "Feb 5", responses: 28, completionRate: 91 },
        { date: "Feb 12", responses: 20, completionRate: 89 },
      ]
    } else if (workflowId === "2") {
      return [
        { date: "Jan 1", responses: 8, completionRate: 80 },
        { date: "Jan 8", responses: 12, completionRate: 85 },
        { date: "Jan 15", responses: 18, completionRate: 90 },
        { date: "Jan 22", responses: 15, completionRate: 87 },
        { date: "Jan 29", responses: 22, completionRate: 92 },
        { date: "Feb 5", responses: 19, completionRate: 88 },
        { date: "Feb 12", responses: 25, completionRate: 93 },
      ]
    } else {
      // Default data for "all" or any other workflow
      return [
        { date: "Jan 1", responses: 35, completionRate: 82 },
        { date: "Jan 8", responses: 42, completionRate: 85 },
        { date: "Jan 15", responses: 58, completionRate: 88 },
        { date: "Jan 22", responses: 65, completionRate: 90 },
        { date: "Jan 29", responses: 72, completionRate: 92 },
        { date: "Feb 5", responses: 80, completionRate: 91 },
        { date: "Feb 12", responses: 95, completionRate: 94 },
      ]
    }
  }

  const responseData = getResponseData(selectedWorkflow)

  const handleWorkflowChange = (value: string) => {
    setSelectedWorkflow(value)
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Response Analytics</CardTitle>
        <Select value={selectedWorkflow} onValueChange={handleWorkflowChange}>
          <SelectTrigger className="w-[200px] border-gray-200">
            <SelectValue placeholder="Select workflow" />
          </SelectTrigger>
          <SelectContent>
            {workflowOptions.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="responses" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="completion">Completion Rate</TabsTrigger>
          </TabsList>
          <TabsContent value="responses" className="h-[250px]">
            <ChartContainer
              config={{
                responses: {
                  label: "Responses",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="responses" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} barSize={30} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4589FF" />
                      <stop offset="100%" stopColor="#8A3FFC" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="completion" className="h-[250px]">
            <ChartContainer
              config={{
                completionRate: {
                  label: "Completion Rate (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#8A3FFC", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#4589FF" }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4589FF" />
                      <stop offset="100%" stopColor="#8A3FFC" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
