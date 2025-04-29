"use client"

import React from "react"

import type { Question, ProbeDepthPreset } from "../types/survey-types"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Sliders, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import LiveProbeSandbox from "./live-probe-sandbox"
import PremiumFeatureModal from "./premium-feature-modal"

interface QuestionSettingsProps {
  question: Question
  onUpdateQuestion: (question: Question) => void
  isOpen: boolean
  onClose: (e?: React.MouseEvent) => void
}

export default function QuestionSettings({ question, onUpdateQuestion, isOpen, onClose }: QuestionSettingsProps) {
  const [showSandbox, setShowSandbox] = React.useState(false)
  const [showPremiumModal, setShowPremiumModal] = React.useState(false)

  // Add this useEffect hook after the state declarations
  React.useEffect(() => {
    // Check if AI follow-up is not enabled and enable it if needed
    if (isOpen && question.aiFollowUp && !question.aiFollowUp.enabled) {
      handleAIFollowUpChange()
    }
  }, [isOpen, question.aiFollowUp])

  const handleAIFollowUpChange = () => {
    onUpdateQuestion({
      ...question,
      aiFollowUp: {
        ...question.aiFollowUp,
        enabled: true,
      },
    })
  }

  const handleProbeDepthChange = (probeDepth: ProbeDepthPreset) => {
    if (probeDepth === "custom") {
      setShowPremiumModal(true)
      return
    }

    onUpdateQuestion({
      ...question,
      aiFollowUp: {
        ...question.aiFollowUp,
        probeDepth,
      },
    })
  }

  const handleCustomDepthChange = (value: number[]) => {
    setShowPremiumModal(true)
  }

  const renderAIFollowUpOptions = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="font-medium">Probe Depth Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              className={cn(
                "p-3 rounded-md border cursor-pointer transition-colors",
                question.aiFollowUp.probeDepth === "auto" ? "border-blue-400 bg-blue-50" : "hover:border-gray-300",
              )}
              onClick={() => handleProbeDepthChange("auto")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Auto</span>
              </div>
              <p className="text-xs text-gray-500">AI decides appropriate follow-ups based on responses.</p>
            </motion.div>

            <motion.div
              className={cn(
                "p-3 rounded-md border cursor-pointer transition-colors",
                question.aiFollowUp.probeDepth === "custom" ? "border-blue-400 bg-blue-50" : "hover:border-gray-300",
              )}
              onClick={() => handleProbeDepthChange("custom")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">
                  Custom <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PRO</span>
                </span>
                <Lock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-xs text-gray-500">Set your own follow-up depth level.</p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Update the return statement to remove the drawer styling and make it inline
  return (
    <>
      <motion.div
        className={cn(
          "w-full bg-white overflow-hidden",
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
        initial={false}
        animate={{
          maxHeight: isOpen ? 800 : 0,
          opacity: isOpen ? 1 : 0,
          marginBottom: isOpen ? 0 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h3 className="font-medium">Question Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                if (e) e.stopPropagation()
                onClose(e)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">{renderAIFollowUpOptions()}</div>
      </motion.div>

      <LiveProbeSandbox
        isOpen={showSandbox}
        onClose={() => setShowSandbox(false)}
        questionTitle={question.title}
        questionType="conversational_question"
      />
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName="Custom Probe Depth"
      />
    </>
  )
}
