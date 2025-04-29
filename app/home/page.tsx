import AccountHeader from "./components/account-header"
import AccountSummary from "./components/account-summary"
import InterviewInsights from "./components/interview-insights"
import QuickActions from "./components/quick-actions"
import RecommendedTemplates from "./components/recommended-templates"
import ResponseChart from "./components/response-chart"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AccountHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <AccountSummary />
            <QuickActions />
            <RecommendedTemplates />
          </div>

          {/* Middle and right columns */}
          <div className="md:col-span-2 space-y-6">
            <ResponseChart />
            <InterviewInsights />
          </div>
        </div>
      </main>
    </div>
  )
}
