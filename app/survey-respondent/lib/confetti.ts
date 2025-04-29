// This is a simple wrapper for canvas-confetti
// In a real project, you would install the package via npm
// For this example, we're using a simplified version

interface ConfettiOptions {
  particleCount?: number
  spread?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  startVelocity?: number
  scalar?: number
  ticks?: number
  shapes?: string[]
  zIndex?: number
}

function createCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null

  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.pointerEvents = "none"
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  canvas.style.zIndex = "999"
  document.body.appendChild(canvas)

  return canvas
}

export default function confetti(options: ConfettiOptions = {}): void {
  if (typeof window === "undefined") return

  // Load the confetti script dynamically
  const script = document.createElement("script")
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"
  script.async = true

  script.onload = () => {
    // @ts-ignore
    if (window.confetti) {
      // @ts-ignore
      window.confetti({
        particleCount: options.particleCount || 100,
        spread: options.spread || 70,
        origin: options.origin || { y: 0.6 },
        colors: options.colors,
        startVelocity: options.startVelocity,
        scalar: options.scalar,
        ticks: options.ticks,
        shapes: options.shapes,
        zIndex: options.zIndex,
      })
    }
  }

  document.head.appendChild(script)
}
