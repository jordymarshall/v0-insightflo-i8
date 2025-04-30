import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AccountStats() {
  // TODO[backend]: Fetch user stats from API
  const stats = {
    totalInterviews: 42,
    completedInterviews: 35,
    averageDuration: "38 min",
    interviewsByMonth: [
      { name: "Jan", count: 4 },
      { name: "Feb", count: 6 },
      { name: "Mar", count: 8 },
      { name: "Apr", count: 12 },
      { name: "May", count: 7 },
      { name: "Jun", count: 5 },
    ],
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Interviews</p>
            <p className="text-2xl font-bold">{stats.totalInterviews}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{stats.completedInterviews}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold">
              {Math.round((stats.completedInterviews / stats.totalInterviews) * 100)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Avg. Duration</p>
            <p className="text-2xl font-bold">{stats.averageDuration}</p>
          </div>
        </div>

        <div className="h-[150px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.interviewsByMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
