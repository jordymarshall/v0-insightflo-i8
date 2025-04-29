"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface NavigationControlsProps {
  onPrevious: () => void
  canGoBack: boolean
  isSubmitting: boolean
}

export default function NavigationControls({ onPrevious, canGoBack, isSubmitting }: NavigationControlsProps) {
  return (
    <div className="flex justify-start mt-2 sm:mt-3">
      {canGoBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-700 gap-1 text-xs sm:text-sm h-7 sm:h-8"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Previous</span>
        </Button>
      )}
    </div>
  )
}
