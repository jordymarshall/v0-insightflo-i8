"use client"

import { useState } from "react"
import HypothesisSelector from "./hypothesis-selector"

// Example hypotheses for demonstration
const exampleHypotheses = [
  {
    id: "h1",
    text: "Users are struggling with the new dashboard layout because the navigation is not intuitive and important features are hidden behind too many clicks.",
    isTestable: true,
  },
  {
    id: "h2",
    text: "The mobile experience is causing frustration because it lacks feature parity with desktop.",
    isTestable: true,
  },
  {
    id: "h3",
    text: "New users abandon the onboarding process because it requires too much information upfront.",
    isTestable: true,
  },
  {
    id: "h4",
    text: "Enterprise customers need better team management features because the current permission system is too limited for complex organizational structures.",
    isTestable: true,
  },
]

export default function HypothesisSelectorDemo() {
  const [selectedHypothesisIds, setSelectedHypothesisIds] = useState<string[]>([])

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4">Hypothesis Selection</h2>

      <HypothesisSelector
        hypotheses={exampleHypotheses}
        selectedIds={selectedHypothesisIds}
        onChange={setSelectedHypothesisIds}
      />

      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Selected Hypotheses:</h3>
        {selectedHypothesisIds.length === 0 ? (
          <p className="text-sm text-gray-500">No hypotheses selected</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {selectedHypothesisIds.map((id) => {
              const hypothesis = exampleHypotheses.find((h) => h.id === id)
              return (
                <li key={id} className="text-sm">
                  {hypothesis?.text.substring(0, 60)}...
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
