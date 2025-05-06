"use client"
import { Sparkles, Lock } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface PremiumFeatureModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
}

export default function PremiumFeatureModal({ isOpen, onClose, featureName }: PremiumFeatureModalProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email)
    setSubmitted(true)
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            <span>Premium Feature</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-1">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg mb-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="bg-amber-200 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900 mb-1">{featureName}</h3>
                <p className="text-sm text-amber-700">This feature is available exclusively to Premium subscribers.</p>
                <p className="text-xs text-amber-600 mt-2 italic">Premium mode coming soon</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Get notified when Premium launches:
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="default"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                {submitted ? "Thanks! We'll notify you" : "Join Premium Waitlist"}
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue with Free Plan
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
