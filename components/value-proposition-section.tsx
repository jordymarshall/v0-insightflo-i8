import { MessageSquare, LineChart, Brain, Lightbulb, UserPlus, Users } from "lucide-react"
import { FadeIn } from "@/components/fade-in"
import { StaggeredFade } from "@/components/staggered-fade"

export function ValuePropositionSection() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />,
      title: "Scale Expert Conversations",
      description:
        "Replace manual interviews and surveys with adaptive AI conversations, capturing richer insights faster and at unlimited scale.",
    },
    {
      icon: <LineChart className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />,
      title: "Contextualize Insights Instantly",
      description:
        "Automatically enrich your insights with agentic market research and anonymized benchmarks, placing your findings in real-time market context.",
    },
    {
      icon: <Brain className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />,
      title: "Continuously Improve Your Insights",
      description:
        "Leverage our data flywheel, continuously fine-tuning AI to deliver increasingly relevant follow-ups and deeper, actionable insights.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />,
      title: "Automate Insight Generation",
      description:
        "Effortlessly transform raw conversations into clear, actionable insights—eliminating hours of manual analysis and synthesis.",
    },
    {
      icon: <UserPlus className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />,
      title: "Maximize Respondent Engagement",
      description:
        "Harness psychological best practices and personalized, human-like conversations to motivate detailed, thoughtful responses and higher completion rates.",
    },
    {
      icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />,
      title: "Simplify Team Collaboration",
      description:
        "Centralize insights, streamline real-time feedback, and accelerate decisions with one intuitive, collaborative platform.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <FadeIn>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 max-w-6xl mx-auto px-2">
              What if getting powerful insights didn't require hours of building, conducting, and analyzing user
              interviews? Meet Insightflo.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Powerful user insights, zero busywork. That's Insightflo.
            </p>
          </div>
        </FadeIn>

        <StaggeredFade
          baseDelay={200}
          staggerDelay={150}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <div key={index} className="group relative h-full scale-on-hover">
              {/* Gradient border that appears on hover - fixed positioning and blur */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>

              {/* Card content with white background */}
              <div className="relative h-full flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-lg border border-transparent group-hover:border-transparent transition-all">
                <div className="mb-3 md:mb-4 animate-float">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </StaggeredFade>
      </div>
    </section>
  )
}
