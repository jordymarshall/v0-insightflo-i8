"use client"

import { motion } from "framer-motion"
import { EyeIcon } from "lucide-react"

export default function PreviewNotification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-blue-50 border border-blue-100 rounded-lg p-2 mt-2 mb-4 text-sm text-blue-700 flex items-center"
    >
      <EyeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
      <span>
        <span className="font-medium">Preview Mode:</span> You are viewing the survey exactly as a respondent would.
        However, your responses will not be saved.
      </span>
    </motion.div>
  )
}
