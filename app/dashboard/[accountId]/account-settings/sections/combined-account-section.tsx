"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Archive } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CombinedAccountSection() {
  const { toast } = useToast()
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const handleDeactivateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO[backend]: Deactivate user account
    // Example:
    // const response = await deactivateAccount(userId, password);

    setIsDeactivateDialogOpen(false)
    toast({
      title: "Account deactivated",
      description: "Your account has been deactivated. You can reactivate it by logging in again.",
    })
  }

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO[backend]: Delete user account
    // Example:
    // const response = await deleteAccount(userId, password);

    setIsDeleteDialogOpen(false)
    toast({
      title: "Account deletion initiated",
      description: "Your account deletion has been initiated. This process may take up to 30 days to complete.",
    })
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Personal Information Card */}
      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle className="text-black">Personal Information</CardTitle>
          <CardDescription className="text-gray-500">Update your name and contact details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 bg-white">
          {/* Name Section */}
          <div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
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
        </CardContent>
      </Card>

      {/* Login & Security Card */}
      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle className="text-black">Login & Security</CardTitle>
          <CardDescription className="text-gray-500">Manage your email and password</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 bg-white">
          {/* Email Section */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Email Address</h3>
            <p className="text-sm text-gray-500 mb-4">This email is used for logging in and notifications</p>

            {!isUpdatingEmail ? (
              <div>
                <p className="font-medium text-black">{userData.email}</p>
                <p className="text-sm text-gray-500">This is the email associated with your account</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-email" className="text-black">
                    Current Email
                  </Label>
                  <Input
                    id="current-email"
                    value={userData.email}
                    disabled
                    className="bg-gray-50 border-gray-200 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-black">
                    New Email
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="Enter your new email"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdatingEmail(false)}
                    className="border-gray-200 bg-white text-black hover:bg-white hover:text-black"
                  >
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

          <Separator className="bg-gray-200" />

          {/* Password Section */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Password</h3>
            <p className="text-sm text-gray-500 mb-4">Ensure your account is using a strong password</p>

            {!isUpdatingPassword ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-black">••••••••</p>
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
                  <Label htmlFor="current-password" className="text-black">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-black">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-black">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdatingPassword(false)}
                    className="border-gray-200 bg-white text-black hover:bg-white hover:text-black"
                  >
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

      {/* Account Management Card */}
      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle className="text-black">Account Management</CardTitle>
          <CardDescription className="text-gray-500">Manage your account status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-white">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-md mt-0.5">
                  <Archive className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-black">Deactivate Account</p>
                  <p className="text-sm text-gray-500">
                    Temporarily deactivate your account. You can reactivate it at any time by logging in again.
                  </p>
                </div>
              </div>
              <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
                <DialogTrigger asChild>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                    <Button
                      variant="outline"
                      className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-black">Deactivate Account</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Are you sure you want to deactivate your account? You can reactivate it at any time by logging in
                      again.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDeactivateAccount}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deactivate-password" className="text-black">
                          Confirm Password
                        </Label>
                        <Input
                          id="deactivate-password"
                          type="password"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDeactivateDialogOpen(false)}
                          className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                        <Button
                          type="submit"
                          variant="outline"
                          className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                        >
                          Confirm Deactivation
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Separator className="bg-gray-200" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-50 p-2 rounded-md mt-0.5">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-black">Delete Account</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Are you sure you want to delete your account? This action cannot be undone and all your data will
                      be permanently deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDeleteAccount}>
                    <div className="grid gap-4 py-4">
                      <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                        <p>Warning: This will:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Delete all your data and content</li>
                          <li>Cancel any active subscriptions</li>
                          <li>Remove your access to all Insightflo services</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delete-password" className="text-black">
                          Confirm Password
                        </Label>
                        <Input
                          id="delete-password"
                          type="password"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirm" className="text-black">
                          Type "DELETE" to confirm
                        </Label>
                        <Input
                          id="delete-confirm"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6] bg-white text-black"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
                        >
                          Cancel
                        </Button>
                      </div>
                      <Button type="submit" variant="destructive">
                        Permanently Delete
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
