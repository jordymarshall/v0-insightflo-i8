import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type RecommendedTemplate = {
  id: string
  title: string
  category: string
  questionCount: number
}

export default function RecommendedTemplates() {
  // TODO[backend]: Fetch recommended templates from API
  const recommendedTemplates: RecommendedTemplate[] = [
    {
      id: "1",
      title: "Product Feedback Survey",
      category: "Product Development",
      questionCount: 12,
    },
    {
      id: "2",
      title: "User Experience Research",
      category: "UX Research",
      questionCount: 15,
    },
    {
      id: "3",
      title: "Customer Satisfaction",
      category: "Customer Success",
      questionCount: 10,
    },
  ]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Recommended Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedTemplates.map((template) => (
            <div key={template.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">{template.title}</h3>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{template.category}</span>
                <span>{template.questionCount} questions</span>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full mt-3 border-[#8A3FFC] text-[#8A3FFC] hover:bg-[#8A3FFC] hover:text-white"
              >
                <Link href={`/templates/${template.id}`}>Use Template</Link>
              </Button>
            </div>
          ))}
          <div className="text-center pt-2">
            <Link href="/templates" className="text-[#8A3FFC] hover:underline text-sm">
              Browse all templates
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
