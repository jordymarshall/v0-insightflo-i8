"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronLeft, User, Mail, MessageSquare } from "lucide-react"

interface PreSurveyFormProps {
  onComplete: (data: PreSurveyData) => void
  onBack: () => void
}

export interface PreSurveyData {
  name: string
  email: string
  additionalInfo: string
}

export default function PreSurveyForm({ onComplete, onBack }: PreSurveyFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onComplete({
        name,
        email,
        additionalInfo,
      })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] bg-dotted-pattern p-4 animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg p-6 sm:p-8"
      >
        {/* Back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 -ml-2 flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5 sm:mb-6 text-[#1a1e27]">Before we begin</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 max-w-lg mx-auto">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm sm:text-base flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 text-gray-500" />
              Your name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="text-sm sm:text-base h-10 sm:h-12 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm sm:text-base flex items-center">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 text-gray-500" />
              Your email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className={`text-sm sm:text-base h-10 sm:h-12 rounded-lg ${
                errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="additionalInfo" className="text-sm sm:text-base flex items-center">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 text-gray-500" />
              Anything else you'd like to share? (optional)
            </Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Share any additional context that might be helpful..."
              className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1a1e27] hover:bg-[#2a2e37] rounded-full h-11 sm:h-14 text-base sm:text-lg font-medium mt-2 sm:mt-3"
            disabled={isSubmitting || !name || !email}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-center text-gray-400">Powered by Insightflo</div>
      </motion.div>
    </div>
  )
}
