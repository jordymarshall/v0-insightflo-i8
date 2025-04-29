"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, X, Database, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSettings({ isOpen, onClose }: GlobalSettingsProps) {
  const [allowAnonymousResponses, setAllowAnonymousResponses] = useState(true)
  const [enableResponseLimit, setEnableResponseLimit] = useState(false)
  const [responseLimit, setResponseLimit] = useState(50)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
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
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Global Settings</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-gray-600 mb-4">Configure general settings for your survey.</p>

              {/* Response Limit Toggle */}
              <Card
                className={cn(
                  "border overflow-hidden transition-all duration-300",
                  enableResponseLimit ? "border-green-200 bg-green-50/30" : "",
                )}
              >
                <div className="p-5 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full flex-shrink-0 transition-colors",
                        enableResponseLimit ? "bg-green-100" : "bg-gray-100",
                      )}
                    >
                      <Database className={cn("h-5 w-5", enableResponseLimit ? "text-green-600" : "text-gray-500")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Set Response Limit</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm p-4" side="bottom">
                              <p>Automatically close your survey after reaching the specified number of responses.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Limit the number of responses your survey will accept before automatically closing.
                      </p>

                      {enableResponseLimit && (
                        <div className="mt-3">
                          <label htmlFor="response-limit" className="text-sm font-medium">
                            Maximum responses:
                          </label>
                          <input
                            id="response-limit"
                            type="number"
                            min="1"
                            max="10000"
                            value={responseLimit}
                            onChange={(e) => setResponseLimit(Number.parseInt(e.target.value) || 50)}
                            className="ml-2 w-24 rounded-md border border-gray-300 px-3 py-1 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      id="enable-limit"
                      checked={enableResponseLimit}
                      onCheckedChange={setEnableResponseLimit}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
