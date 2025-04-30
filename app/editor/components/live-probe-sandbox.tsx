"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, MessageSquare, User, Bot } from "lucide-react"

interface LiveProbeSandboxProps {
  isOpen: boolean
  onClose: () => void
  questionTitle: string
  questionType: string
}

export default function LiveProbeSandbox({ isOpen, onClose, questionTitle, questionType }: LiveProbeSandboxProps) {
  const [userResponse, setUserResponse] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: userResponse }])

    // Clear input
    setUserResponse("")

    // Simulate AI thinking
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false)
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "That's interesting! Can you tell me more about why you feel that way?",
        },
      ])
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium">Live Probe Sandbox</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="mb-4 p-3 bg-gray-50 rounded-md border">
                <p className="text-sm font-medium">Question:</p>
                <p className="text-base">{questionTitle}</p>
              </div>

              <div className="space-y-4 mb-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        <span className="text-xs font-medium">{message.role === "user" ? "You" : "AI Assistant"}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {conversation.length === 0 && !isTyping && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Type a response to the question above to see how the AI would follow up.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmitResponse()
                    }
                  }}
                />
                <Button onClick={handleSubmitResponse} disabled={!userResponse.trim() || isTyping}>
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
