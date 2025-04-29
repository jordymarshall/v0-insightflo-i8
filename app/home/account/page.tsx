import { Suspense } from "react"
import AccountHeader from "../components/account-header"
import InterviewInsights from "../components/interview-insights"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white">
      <AccountHeader />
      <main className="container mx-auto px-8 sm:px-12 md:px-16 py-8">
        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
            <InterviewInsights />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
