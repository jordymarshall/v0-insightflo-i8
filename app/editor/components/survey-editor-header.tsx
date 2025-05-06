"use client"

import { useState, useEffect } from "react"
import type { SaveStatus } from "../types/survey-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Settings, Share2, Eye, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import GlobalSettings from "./global-settings"
import InsightBoostersModal from "./insights-boosters-modal"
import { useIsMobile } from "../hooks/use-mobile"

interface SurveyEditorHeaderProps {
  saveStatus?: SaveStatus // Make saveStatus optional
}

// Update the component to include the Insight Boosters button
export default function SurveyEditorHeader({ saveStatus = { status: "saved" } }: SurveyEditorHeaderProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [showGlobalSettings, setShowGlobalSettings] = useState(false)
  const [showInsightBoosters, setShowInsightBoosters] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(
    typeof window !== "undefined" && !localStorage.getItem("insightBoostersViewed"),
  )
  const [surveyDescription, setSurveyDescription] = useState(
    "Understand customer satisfaction with our latest product update",
  )

  const isMobile = useIsMobile()

  // Add this at the top of the component, after the state declarations
  // This ensures we don't trigger auto-save on initial load
  useEffect(() => {
    // This effect is intentionally empty to prevent any auto-save on initial load
    return () => {
      // Cleanup function (empty in this case)
    }
  }, []) // Empty dependency array means this runs only once on mount

  // Add effect to control the pulse animation
  useEffect(() => {
    // No timer needed - animation stays until clicked
    return () => {
      // Cleanup function (empty in this case)
    }
  }, [])

  const handleSave = () => {
    // Only trigger saving state when explicitly called by button click
    setIsSaving(true)
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false)
      setJustSaved(true)
      // Reset the success state after a delay
      setTimeout(() => {
        setJustSaved(false)
      }, 2000)
    }, 1000)
    // Here you would typically call your actual save function
    // For example: saveSurvey(questions)
  }

  const handleShowInsightBoosters = () => {
    setShowInsightBoosters(true)
    setPulseAnimation(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("insightBoostersViewed", "true")
    }
  }

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex flex-col min-w-0 flex-1 mr-4 overflow-visible w-full">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to surveys</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              defaultValue="Customer Satisfaction Survey"
              className="h-8 text-lg font-medium border-transparent focus-visible:border-input focus-visible:ring-0 focus-visible:border-opacity-30 bg-transparent w-full min-w-0 max-w-[500px] sm:max-w-[600px] md:max-w-[800px] text-ellipsis py-0 px-2 mb-0"
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="ml-10 mt-0 mb-0 -mt-1">
            <Input
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="Add a description for your interview..."
              className="h-5 text-sm text-gray-500 border-transparent focus-visible:border-input focus-visible:ring-0 focus-visible:border-opacity-30 bg-transparent w-full min-w-0 max-w-[500px] sm:max-w-[600px] md:max-w-[800px] text-ellipsis py-0 px-2 leading-tight"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
          {saveStatus.status === "saving" && !isMobile && (
            <motion.span
              className="text-sm text-muted-foreground flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Saving...
            </motion.span>
          )}

          {saveStatus.status === "error" && !isMobile && (
            <motion.span
              className="text-sm text-red-500 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Error saving: {saveStatus.error}
            </motion.span>
          )}

          {/* Updated Market Intelligence button with PRO tag */}
          {!isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-1 relative overflow-hidden ${pulseAnimation ? "border-transparent" : ""}`}
                    onClick={() => handleShowInsightBoosters()}
                  >
                    {pulseAnimation && (
                      <span className="absolute inset-0 rounded-md overflow-hidden">
                        <span
                          className="absolute inset-0 rounded-md border-2 border-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-[length:200%_100%] animate-gradient-x"
                          style={{
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                          }}
                        ></span>
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">PRO</span>
                      <span>Market Intelligence</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enhance your survey with powerful insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Mobile-optimized Market Intelligence button */}
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 relative overflow-hidden ${pulseAnimation ? "border-transparent" : ""}`}
              onClick={() => handleShowInsightBoosters()}
            >
              {pulseAnimation && (
                <span className="absolute inset-0 rounded-md overflow-hidden">
                  <span
                    className="absolute inset-0 rounded-md border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-[length:200%_100%] animate-gradient-x"
                    style={{
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  ></span>
                </span>
              )}
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">PRO</span>
            </Button>
          )}

          {saveStatus.status === "saved" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={`h-9 w-9 transition-colors ${justSaved ? "bg-green-50 text-green-600 border-green-200" : ""}`}
                    disabled={isSaving || justSaved}
                  >
                    {isSaving ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    ) : justSaved ? (
                      <svg
                        className="h-4 w-4 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 21v-8H7v8M7 3v5h8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save survey</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setShowGlobalSettings(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Survey settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Eye className="h-4 w-4" />
                <span>Preview Interview</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Rocket className="h-4 w-4" />
                <span>Deploy Interview</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <GlobalSettings isOpen={showGlobalSettings} onClose={() => setShowGlobalSettings(false)} />
      <InsightBoostersModal
        isOpen={showInsightBoosters}
        onClose={() => setShowInsightBoosters(false)}
        onPremiumModalOpen={() => setShowGlobalSettings(true)}
      />
    </>
  )
}
