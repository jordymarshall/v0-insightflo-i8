import type React from "react"
export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>Account Settings</h1>
      {children}
    </div>
  )
}
