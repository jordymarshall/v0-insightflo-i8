"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { FaqSection } from "@/components/faq-section"
import { ValuePropositionSection } from "@/components/value-proposition-section"
import { TypingEffect } from "@/components/typing-effect"
import { FadeIn } from "@/components/fade-in"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function LandingPage() {
  // State to track if component is mounted (for SSR compatibility)
  const [isMounted, setIsMounted] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Add these new state variables
  const [isFocused, setIsFocused] = useState(false)
  const [userHasTyped, setUserHasTyped] = useState(false)

  const placeholderTexts = [
    "Interview recent users who considered but ultimately decided against purchasing our premium subscription, to deeply understand their hesitations and underlying concerns.",
    "Speak with customers who recently left negative reviews about our customer service to unpack their emotional experiences and expectations in greater depth.",
    "Conduct interviews with loyal customers who consistently recommend us, to uncover what personally motivates them to advocate for our brand.",
    "Talk directly with users who switched from a competitor's solution to ours, to learn about their exact reasons, experiences, and unmet needs from the competitor.",
    "Interview recent first-time buyers of our product to discover their true motivations, decision-making criteria, and any emotional drivers behind their purchase.",
    "Explore through detailed conversations why previously active community members suddenly stopped engaging, to deeply understand their underlying reasons or changes in perception.",
    "Interview potential users who chose not to adopt our solution after detailed demos, to reveal hidden objections or perceptions they might not openly share otherwise.",
    "Speak to recent hires about their onboarding experience, specifically exploring feelings of belonging, anxiety, and support to improve team integration.",
    "Conduct interviews with power users to deeply understand their workflow, uncovering nuanced pain points or workarounds they haven't explicitly reported.",
    "Talk with customers who recently downgraded their plans about their detailed reasoning, priorities, and the emotional or contextual factors influencing their decisions.",
  ]

  useEffect(() => {
    setIsMounted(true)

    // Start the placeholder typing effect after a short delay
    const timer = setTimeout(() => {
      setShowPlaceholder(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleTypingComplete = () => {
    // Add a blinking cursor effect after typing is complete
    if (textareaRef.current) {
      textareaRef.current.classList.add("cursor-blink")
    }
  }

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <>
      <Header />
      <div className="flex flex-col bg-white transition-colors duration-300">
        {/* First screen - exactly viewport height with centered content */}
        <div className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-16 px-4 md:pt-16 md:pb-8">
          <div className="container mx-auto flex flex-col justify-center items-center flex-grow">
            <div className="mx-auto max-w-5xl text-center mb-6 md:mb-8 w-full">
              {/* Title - Larger on mobile with controlled line break */}
              <FadeIn delay={300} duration={800}>
                <div className="mb-4 flex flex-col items-center justify-center pt-4 sm:pt-0">
                  <h1 className="text-4xl xs:text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center leading-tight md:leading-normal px-1 mx-auto">
                    <span className="text-gray-900 block sm:inline">User Interviews</span>{" "}
                    <span className="bg-gradient-to-r from-purple-500 via-violet-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift block sm:inline mt-1 sm:mt-0">
                      on Autopilot
                    </span>
                  </h1>
                </div>
              </FadeIn>

              {/* Subtitle - Responsive font sizes */}
              <FadeIn delay={600} duration={800}>
                <p className="mx-auto mb-6 md:mb-8 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 px-2">
                  Conversations at scale, contextualized with real-time agentic market intelligence to supercharge your
                  insights.
                </p>
              </FadeIn>
            </div>

            {/* Prompt box - Adjusted for mobile */}
            <div className="w-full max-w-3xl mx-auto">
              <FadeIn delay={900} duration={1000} direction="up">
                <div className="relative mx-auto mb-8 md:mb-10 h-[200px] sm:h-[180px] w-full">
                  {/* Outer gradient glow - purple to blue */}
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-40 blur-md animate-pulse"></div>

                  <Card className="relative h-full overflow-hidden border-0 bg-white p-4 sm:p-6 shadow-lg">
                    {showPlaceholder && !isFocused && !userHasTyped ? (
                      <div className="relative h-full">
                        <TypingEffect
                          texts={placeholderTexts}
                          delay={30}
                          eraseDelay={10}
                          pauseBetweenTexts={3000}
                          className="h-full w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 resize-none overflow-auto text-gray-600 placeholder:text-gray-400 block absolute top-0 left-0 pointer-events-none"
                          onComplete={handleTypingComplete}
                        />
                        <Textarea
                          ref={textareaRef}
                          className="h-full w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 resize-none overflow-auto text-gray-600 placeholder:text-gray-400 absolute top-0 left-0 z-10"
                          placeholder=""
                          style={{ fontSize: "16px", background: "transparent" }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => {
                            setIsFocused(false)
                            // Only restart animation if user hasn't typed anything
                            if (!textareaRef.current?.value) {
                              setUserHasTyped(false)
                            }
                          }}
                          onChange={(e) => {
                            if (e.target.value) {
                              setUserHasTyped(true)
                            } else {
                              setUserHasTyped(false)
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <Textarea
                        ref={textareaRef}
                        className="h-full w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 resize-none overflow-auto text-gray-600 placeholder:text-gray-400"
                        placeholder="Tell us about your context and interview goals with as much detail as possible..."
                        style={{ fontSize: "16px" }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                          setIsFocused(false)
                          // Only restart animation if user hasn't typed anything
                          if (!textareaRef.current?.value) {
                            setUserHasTyped(false)
                          }
                        }}
                        onChange={(e) => {
                          if (e.target.value) {
                            setUserHasTyped(true)
                          } else {
                            setUserHasTyped(false)
                          }
                        }}
                      />
                    )}
                  </Card>
                </div>
              </FadeIn>

              {/* Buttons - Adjusted for mobile */}
              <div className="flex flex-col items-center justify-center space-y-4 mb-12 md:mb-0 w-full">
                {/* Refined Generate Workflow CTA with scale animation */}
                <FadeIn delay={1200} duration={800} className="w-full flex justify-center">
                  <div className="relative inline-block group">
                    {/* Button with matching gradient from "on Autopilot" text and scale animation */}
                    <Button className="relative h-12 md:h-14 rounded-xl bg-gradient-to-r from-purple-500 via-violet-400 to-blue-400 px-6 md:px-10 text-base md:text-lg font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 transform hover:scale-105">
                      {/* Button text with underline animation */}
                      <span className="relative">
                        Generate Workflow
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>

                      {/* Arrow with enhanced animation */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 transform group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Button>
                  </div>
                </FadeIn>
                <FadeIn delay={1400} duration={800} className="w-full flex justify-center">
                  <Link
                    href="#"
                    className="text-sm md:text-base font-medium text-purple-600 underline decoration-dotted underline-offset-4 hover:text-purple-800 transition-colors duration-300"
                  >
                    Or start blank canvas
                  </Link>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Scroll indicator at the bottom of first screen - Fixed positioning for mobile */}
          <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={scrollToNextSection}
              className="flex flex-col items-center text-gray-500 hover:text-gray-800 transition-colors duration-300 animate-subtle-float"
              aria-label="Scroll to learn more"
            >
              <span className="text-xs md:text-sm mb-1 opacity-80">Learn more</span>
              <ChevronDown className="h-5 w-5 md:h-6 md:w-6 opacity-70" />
            </button>
          </div>
        </div>

        {/* Second screen - Value Proposition Section */}
        <div id="value-proposition" className="min-h-screen">
          <ValuePropositionSection />
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </>
  )
}
