/**
 * Utility for managing chat scrolling behavior
 */

let isDebugEnabled = false

/**
 * Enable or disable debug logging
 */
const setDebug = (enabled: boolean) => {
  isDebugEnabled = enabled
}

/**
 * Log debug messages if debug is enabled
 */
const debug = (message: string) => {
  if (isDebugEnabled) {
    console.log(`[ChatScroll] ${message}`)
  }
}

/**
 * Scroll to the bottom of a container with smooth animation
 */
const scrollToBottom = (container: HTMLElement) => {
  try {
    debug("Scrolling to bottom")

    // Use smooth scrolling for better UX
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    })

    // Also try scrollIntoView on the last child as a fallback
    const lastChild = container.lastElementChild
    if (lastChild) {
      lastChild.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  } catch (error) {
    console.error("Error scrolling chat:", error)
  }
}

/**
 * Scroll to a specific element within the container
 */
const scrollToElement = (container: HTMLElement, element: HTMLElement) => {
  try {
    debug(`Scrolling to element`)

    element.scrollIntoView({ behavior: "smooth", block: "nearest" })
  } catch (error) {
    console.error("Error scrolling to element:", error)
  }
}

/**
 * Check if container is scrolled to bottom (with a small threshold)
 */
const isScrolledToBottom = (container: HTMLElement, threshold = 50) => {
  const scrollPosition = container.scrollTop + container.clientHeight
  const scrollHeight = container.scrollHeight

  return scrollHeight - scrollPosition <= threshold
}

// Export all functions as a default object
export default {
  scrollToBottom,
  scrollToElement,
  isScrolledToBottom,
  setDebug,
  debug,
}
