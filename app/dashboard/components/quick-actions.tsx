import Link from "next/link"
import { Zap, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuickActions() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          <Link href="/interviews/new" className="flex items-center w-full p-2">
            <Zap className="mr-2 h-4 w-4" />
            Generate Workflow
          </Link>
        </div>
        <div className="border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          <Link href="/account/settings" className="flex items-center w-full p-2">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
