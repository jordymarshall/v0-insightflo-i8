"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Sparkles, BarChart, ShieldCheck } from "lucide-react"

interface WelcomeScreenProps {
  title: string
  description: string
  onStart: () => void
}

export default function WelcomeScreen({ title, description, onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] bg-dotted-pattern p-4 animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg p-6 sm:p-8"
      >
        {/* Logo */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="bg-[#1a1e27] w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-white stroke-[1.5]" />
          </div>
        </div>

        {/* Title and description */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-2 sm:mb-3 text-[#1a1e27]">
          We want your perspective!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-6 sm:mb-8">
          Share your thoughts in a conversation that flows naturally
        </p>

        {/* Feature list - more compact */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 max-w-xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1a1e27]">Conversational Experience</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Enjoy a natural chat-based interview that adapts to your responses
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1a1e27]">Intelligent Follow-ups</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We'll explore your insights with thoughtful questions that matter
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0">
              <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1a1e27]">Make a Difference</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your valuable input directly shapes our understanding
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={onStart}
          className="w-full bg-[#1a1e27] hover:bg-[#2a2e37] rounded-full h-12 sm:h-14 text-base sm:text-lg font-medium"
        >
          Begin Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Confidentiality note */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center text-xs sm:text-sm text-gray-500">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Your responses are confidential and secure
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-center text-gray-400">Powered by Insightflo</div>
      </motion.div>
    </div>
  )
}
