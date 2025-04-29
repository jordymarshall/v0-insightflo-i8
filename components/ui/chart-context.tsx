"use client"

import * as React from "react"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

export const ChartContext = React.createContext<ChartContextValue>({
  config: {},
})
