"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProblemStatementBandProps {
  isExpanded: boolean
  onToggleExpand: () => void
  problemStatement: string
  onProblemStatementChange: (value: string) => void
}

export default function ProblemStatementBand({
  isExpanded,
  onToggleExpand,
  problemStatement,
  onProblemStatementChange,
}: ProblemStatementBandProps) {
  return (
    <div
      className={cn(
        "border-b bg-white transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "pb-4" : "",
      )}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={onToggleExpand}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-800">Problem Statement</h3>
          <span className="text-sm text-gray-500">(The WHY)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {problemStatement ? "Problem defined" : "Define your research problem"}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 space-y-4"
          >
            {/* North Star Problem Statement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label htmlFor="problem-statement" className="block text-sm font-medium text-gray-700">
                    North Star Problem Statement
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Define the core research question or problem that guides everything else. This ensures
                          alignment with strategic goals.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-xs text-gray-500">
                  {problemStatement ? `${problemStatement.length}/200` : "0/200"}
                </span>
              </div>
              <div className="relative">
                <Textarea
                  id="problem-statement"
                  placeholder="What is the main question or problem we're trying to solve? (e.g., Why are users dropping off during onboarding?)"
                  value={problemStatement}
                  onChange={(e) => onProblemStatementChange(e.target.value.slice(0, 200))}
                  className="min-h-[80px] resize-none border-blue-200 focus-visible:ring-blue-400"
                />
                {!problemStatement && (
                  <div className="absolute top-2 right-2 bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full border border-amber-200">
                    Required
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
