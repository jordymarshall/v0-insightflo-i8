"use client";

import CombinedAccountSection from "./sections/combined-account-section";
import { SettingsHeader } from "./components/settings-header";
import Link from "next/link";

export default function AccountSettingsLayout() {
  return (
    <>
      <SettingsHeader />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto py-10 px-4 max-w-6xl pt-24 pb-16 bg-white">
          <div className="mb-10 bg-white">
            <h1 className="text-3xl font-bold mb-3 text-black">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and settings
            </p>
          </div>

          <CombinedAccountSection />

          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 bg-white">
            <div className="flex justify-center space-x-6">
              <Link
                href="/terms"
                className="hover:text-[#8A70D6] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#8A70D6] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
