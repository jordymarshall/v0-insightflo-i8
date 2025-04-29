"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/app/landing/components/theme-toggle"

export function Header() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={scrollToTop} className="flex items-center cursor-pointer" aria-label="Back to top">
          <span className="text-lg md:text-xl font-bold text-black">insightflo</span>
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button
            className="bg-white text-black border border-black hover:bg-gray-100 text-sm px-3 py-1 h-8 md:h-10 md:px-4 md:py-2 md:text-base"
            asChild
          >
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button
            className="bg-black text-white border border-white hover:bg-gray-900 text-sm px-3 py-1 h-8 md:h-10 md:px-4 md:py-2 md:text-base"
            asChild
          >
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
