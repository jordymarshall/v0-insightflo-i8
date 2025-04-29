"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

interface QuestionLimitWarningProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
}

export function QuestionLimitWarning({ open, onClose, onProceed }: QuestionLimitWarningProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-md border-amber-200">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="flex items-center text-lg text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            ⚠️ Warning
          </AlertDialogTitle>
          <div className="pt-2 pb-1 border-b border-amber-100"></div>
        </AlertDialogHeader>
        <div className="py-3 space-y-4 text-gray-700">
          <p className="text-sm leading-relaxed">
            Adding too many questions often reduces completion rates and dilutes the quality of your insights. Because
            each question already generates multiple follow-ups, keeping your conversation focused will typically yield
            richer, more meaningful responses.
          </p>
          <div className="bg-green-50 p-3 rounded-md text-sm text-green-800 border border-green-100">
            <p className="font-medium mb-1">Professional tip:</p>
            <p>
              Consider refining your existing questions for greater depth rather than adding additional ones.
              High-quality insights typically come from exploring fewer questions more thoroughly.
            </p>
          </div>
        </div>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="mt-0 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onProceed} className="mt-0 bg-amber-600 hover:bg-amber-700 text-white border-0">
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
