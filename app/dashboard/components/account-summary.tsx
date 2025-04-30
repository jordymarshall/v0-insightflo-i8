import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AccountSummary() {
  // TODO[backend]: Fetch user account data from API
  const user = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    plan: "Professional",
    memberSince: "April 2022",
    company: "Acme Inc.",
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Account Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center sm:text-left sm:items-start">
          <div className="space-y-3">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 mb-4">
              <Badge variant="secondary" className="bg-[#F3F1FF] text-[#8A3FFC] hover:bg-[#F3F1FF]">
                {user.role}
              </Badge>
              <Badge variant="outline" className="bg-[#EDF5FF] text-[#4589FF] hover:bg-[#EDF5FF] border-[#4589FF]">
                {user.plan} Plan
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-2 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="text-gray-500">Member since</span>
                <span>{user.memberSince}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-500">Organization</span>
                <span>{user.company}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
