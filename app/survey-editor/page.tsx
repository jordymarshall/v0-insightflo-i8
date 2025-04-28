import Link from "next/link"

export default function SurveyEditorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold">Survey Editor</h1>
        <p className="mt-4 text-lg text-gray-600">This is the main Survey Editor page. Select a specific view below:</p>
        <div className="flex flex-col mt-8 space-y-4">
          <Link
            href="/survey-editor/context"
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Survey Context
          </Link>
          <Link
            href="/survey-editor/questions"
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Questions
          </Link>
          <Link
            href="/survey-editor/insights"
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Insights
          </Link>
        </div>
      </div>
    </div>
  )
}
