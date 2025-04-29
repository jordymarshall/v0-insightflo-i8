"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Globe, Search, Info, Lock, Shield, X, ChevronDown, ChevronUp, Database, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface InsightBoostersModalProps {
  isOpen: boolean
  onClose: () => void
  onPremiumModalOpen?: () => void // Make this optional
}

export default function InsightBoostersModal({
  isOpen,
  onClose,
  onPremiumModalOpen = () => {}, // Provide default empty function
}: InsightBoostersModalProps) {
  const [insightShare, setInsightShare] = useState(true)
  const [smartInsights, setSmartInsights] = useState(true)
  const [adaptiveFollowups, setAdaptiveFollowups] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showProFeatures, setShowProFeatures] = useState(false)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const handlePremiumClick = () => {
    setShowProFeatures(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Market Intelligence{" "}
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PRO</span>
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 pl-11">
                Enable these powerful features to dramatically improve the quality and depth of your survey insights.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Insight Share Toggle */}
              <Card
                className={cn(
                  "border overflow-hidden transition-all duration-300",
                  insightShare ? "border-blue-200 bg-blue-50/30" : "",
                )}
              >
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full flex-shrink-0 transition-colors",
                            insightShare ? "bg-blue-100" : "bg-gray-100",
                          )}
                        >
                          <Globe className={cn("h-5 w-5", insightShare ? "text-blue-600" : "text-gray-500")} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Enable Insight‑Share™</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Data Cloud Layer
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                    <Info className="h-3.5 w-3.5 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm p-4" side="bottom">
                                  <div className="space-y-2">
                                    <p>
                                      When enabled, your survey benefits from secure, aggregated data across our
                                      network—improving question quality and providing instant benchmarks. Your specific
                                      responses never leave your account.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                      <Shield className="h-4 w-4" />
                                      <span>Your raw data stays private</span>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Get smarter questions and clearer benchmarks by anonymously sharing aggregated insights with
                            our secure data-cloud. Your raw data stays private—only de-identified insights are shared.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch
                          id="insight-share"
                          checked={insightShare}
                          onCheckedChange={setInsightShare}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full",
                            insightShare ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500",
                          )}
                        >
                          <Database className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {insightShare ? "Better insights & benchmarks" : "Data stays completely isolated"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500"
                        onClick={() => toggleSection("insight-share")}
                      >
                        {expandedSection === "insight-share" ? (
                          <>
                            <span>Less info</span>
                            <ChevronUp className="h-3 w-3 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>More info</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedSection === "insight-share" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 border-t">
                          <h4 className="font-medium text-sm mb-2">How Insight-Share™ works:</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                <Shield className="h-3 w-3 text-blue-600" />
                              </div>
                              <span>Your raw response data always stays within your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                <Lock className="h-3 w-3 text-blue-600" />
                              </div>
                              <span>Only anonymized, aggregated insights are shared with our data cloud</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                <Sparkles className="h-3 w-3 text-blue-600" />
                              </div>
                              <span>You gain access to industry benchmarks and improved question suggestions</span>
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Smart Insights Toggle */}
              <Card
                className={cn(
                  "border overflow-hidden transition-all duration-300",
                  smartInsights ? "border-purple-200 bg-purple-50/30" : "",
                )}
                style={{ cursor: "pointer" }}
                // onClick removed to disable functionality
              >
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full flex-shrink-0 transition-colors",
                            smartInsights ? "bg-purple-100" : "bg-gray-100",
                          )}
                        >
                          <Search className={cn("h-5 w-5", smartInsights ? "text-purple-600" : "text-gray-500")} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Smart Insights</h3>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              Real-time Insight Enrichment
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                    <Info className="h-3.5 w-3.5 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm p-4" side="bottom">
                                  <p>
                                    Our Insight Engine uses Retrieval-Augmented Generation (RAG) technology to
                                    automatically research and enrich responses as they come in, making your insights
                                    clearer, more accurate, and grounded in real-world context.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Get deeper insights instantly. We automatically research your survey questions and responses
                            in real-time, pulling verified facts, reviews, and related news to reveal hidden patterns
                            and trends.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch
                          id="smart-insights"
                          checked={smartInsights}
                          onCheckedChange={setSmartInsights}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full",
                            smartInsights ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500",
                          )}
                        >
                          <Zap className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {smartInsights ? "Deeper insights through live research" : "Insights from responses only"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500"
                        onClick={() => toggleSection("smart-insights")}
                      >
                        {expandedSection === "smart-insights" ? (
                          <>
                            <span>Less info</span>
                            <ChevronUp className="h-3 w-3 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>More info</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedSection === "smart-insights" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 border-t">
                          <h4 className="font-medium text-sm mb-2">How Smart Insights works:</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                                <Search className="h-3 w-3 text-purple-600" />
                              </div>
                              <span>Our AI automatically researches topics mentioned in responses</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                                <Sparkles className="h-3 w-3 text-purple-600" />
                              </div>
                              <span>Enriches your data with verified facts, reviews, and related information</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-purple-100 p-1 rounded-full mt-0.5">
                                <Zap className="h-3 w-3 text-purple-600" />
                              </div>
                              <span>Reveals hidden patterns and trends you might otherwise miss</span>
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Adaptive Follow-ups Toggle */}
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-col space-y-3">
                <p className="text-sm text-gray-600">
                  Enter your email to join the waitlist for our market intelligence features
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onPremiumModalOpen) {
                        onPremiumModalOpen()
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
