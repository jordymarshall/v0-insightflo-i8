import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type RecommendedTemplate = {
  id: string
  title: string
  category: string
  popularity: string
}

export default function RecommendedInterviews() {
  // TODO[backend]: Fetch recommended templates from API
  const recommendedTemplates: RecommendedTemplate[] = [
    {
      id: "1",
      title: "Frontend Developer Interview",
      category: "Technical",
      popularity: "High",
    },
    {
      id: "2",
      title: "Leadership Assessment",
      category: "Behavioral",
      popularity: "Medium",
    },
    {
      id: "3",
      title: "Customer Service Screening",
      category: "Screening",
      popularity: "High",
    },
  ]

  return (
    <Card>
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
                <span>Popularity: {template.popularity}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full mt-3">
                <Link href={`/templates/${template.id}`}>Use Template</Link>
              </Button>
            </div>
          ))}
          <div className="text-center pt-2">
            <Link href="/templates" className="text-blue-600 hover:underline text-sm">
              Browse all templates
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
