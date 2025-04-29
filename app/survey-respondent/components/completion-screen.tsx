"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CompletionScreenProps {
  respondentName?: string
  onSubmitFeedback?: (feedback: { experience: string; futureParticipation: boolean }) => void
}

export default function CompletionScreen({ respondentName, onSubmitFeedback }: CompletionScreenProps) {
  const [experienceFeedback, setExperienceFeedback] = useState("")
  const [futureParticipation, setFutureParticipation] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (onSubmitFeedback) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        onSubmitFeedback({
          experience: experienceFeedback,
          futureParticipation: futureParticipation === "yes",
        })
        setIsSubmitting(false)
        setIsSubmitted(true)
      }, 800)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">
          {respondentName ? `Thank you, ${respondentName}!` : "Thank you!"}
        </h1>

        <p className="text-sm sm:text-base text-gray-600 text-center mb-5 sm:mb-6">
          Your responses have been successfully submitted. We appreciate your time and valuable feedback.
        </p>

        {!isSubmitted ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="experience-feedback" className="text-xs sm:text-sm font-medium">
                How was your chat experience? (optional)
              </Label>
              <Textarea
                id="experience-feedback"
                placeholder="Share any thoughts about your experience with this chat interview..."
                value={experienceFeedback}
                onChange={(e) => setExperienceFeedback(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm font-medium">
                Would you like to be considered for future interviews as a key contributor to our team?
              </Label>
              <RadioGroup value={futureParticipation || ""} onValueChange={setFutureParticipation}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="future-yes" />
                  <Label htmlFor="future-yes" className="cursor-pointer text-sm">
                    Yes, I'm interested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="future-no" />
                  <Label htmlFor="future-no" className="cursor-pointer text-sm">
                    No, thank you
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 mt-4">Thank you for your feedback!</div>
        )}
      </motion.div>
    </div>
  )
}
