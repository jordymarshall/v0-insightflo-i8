import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function InsightStats() {
  // TODO[backend]: Fetch user stats from API
  const stats = {
    totalInterviews: 42,
    completedInterviews: 35,
    totalResponses: 487,
    averageInsightScore: 82,
    responsesByMonth: [
      { name: "Jan", count: 45 },
      { name: "Feb", count: 67 },
      { name: "Mar", count: 89 },
      { name: "Apr", count: 112 },
      { name: "May", count: 78 },
      { name: "Jun", count: 96 },
    ],
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Insight Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Interviews</p>
            <p className="text-2xl font-bold">{stats.totalInterviews}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-2xl font-bold">{stats.totalResponses}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold">
              {Math.round((stats.completedInterviews / stats.totalInterviews) * 100)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Avg. Insight Score</p>
            <p className="text-2xl font-bold text-[#4589FF]">{stats.averageInsightScore}%</p>
          </div>
        </div>

        <div className="h-[150px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.responsesByMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8A3FFC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
