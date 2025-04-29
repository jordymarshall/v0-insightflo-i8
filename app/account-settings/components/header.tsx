"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center cursor-pointer" aria-label="Back to home">
          <span className="text-xl font-bold text-black">insightflo</span>
        </Link>
      </div>
    </header>
  )
}
