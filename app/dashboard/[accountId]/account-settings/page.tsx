import type { Metadata } from "next"
import AccountSettingsLayout from "./account-settings-layout"

export const metadata: Metadata = {
  title: "Account Settings | Insightflo",
  description: "Manage your Insightflo account settings and profile information.",
}

export default function AccountSettingsPage() {
  return (
    <div className="bg-white">
      <AccountSettingsLayout />
    </div>
  )
}
