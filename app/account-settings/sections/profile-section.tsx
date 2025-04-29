"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function ProfileSection() {
  const { toast } = useToast()
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Mock user data - would come from API in real implementation
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
  })

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO[backend]: Update user email in the database
    // Example:
    // const response = await updateUserEmail(userData.email);

    setIsUpdatingEmail(false)
    toast({
      title: "Email updated",
      description: "Your email has been updated successfully.",
    })
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO[backend]: Update user password in the database
    // Example:
    // const response = await updateUserPassword(currentPassword, newPassword);

    setIsUpdatingPassword(false)
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO[backend]: Update user profile in the database
    // Example:
    // const response = await updateUserProfile(userData);

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Name Section */}
          <div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                />
              </div>
              <div className="flex justify-end">
                <div className="relative group">
                  {/* Gradient border that appears on hover - fixed positioning and blur */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <Separator />

          {/* Email Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Email Address</h3>
            <p className="text-sm text-gray-500 mb-4">Update your email address</p>

            {!isUpdatingEmail ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{userData.email}</p>
                  <p className="text-sm text-gray-500">This is the email associated with your account</p>
                </div>
                <div className="relative group">
                  {/* Gradient border that appears on hover - fixed positioning and blur */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdatingEmail(true)}
                    className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                  >
                    Change Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-email">Current Email</Label>
                  <Input id="current-email" value={userData.email} disabled className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">New Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="Enter your new email"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsUpdatingEmail(false)} className="border-gray-200">
                    Cancel
                  </Button>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                    >
                      Update Email
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <Separator />

          {/* Password Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Password</h3>
            <p className="text-sm text-gray-500 mb-4">Update your password</p>

            {!isUpdatingPassword ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">••••••••</p>
                  <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                </div>
                <div className="relative group">
                  {/* Gradient border that appears on hover - fixed positioning and blur */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdatingPassword(true)}
                    className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsUpdatingPassword(false)} className="border-gray-200">
                    Cancel
                  </Button>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
