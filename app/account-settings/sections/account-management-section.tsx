"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Download, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountManagementSection() {
  const { toast } = useToast()
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleExportData = () => {
    // TODO[backend]: Generate and download user data
    // Example:
    // const response = await exportUserData(userId);
    // downloadFile(response.url);

    toast({
      title: "Data export initiated",
      description: "Your data export has been initiated. You will receive an email when it's ready to download.",
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
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Download a copy of your data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-md mt-0.5">
                <Download className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Export Account Data</p>
                <p className="text-sm text-gray-500">
                  Download a copy of your personal data, including your profile information, activity, and settings.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] pointer-events-none"></div>
              <Button
                variant="outline"
                onClick={handleExportData}
                className="relative border border-gray-200 text-black bg-white hover:bg-white hover:text-black"
              >
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-6">
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Manage your account status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-md mt-0.5">
                  <Archive className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Deactivate Account</p>
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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Deactivate Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deactivate your account? You can reactivate it at any time by logging in
                      again.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDeactivateAccount}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deactivate-password">Confirm Password</Label>
                        <Input
                          id="deactivate-password"
                          type="password"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
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

            <Separator />

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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
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
                        <Label htmlFor="delete-password">Confirm Password</Label>
                        <Input
                          id="delete-password"
                          type="password"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirm">Type "DELETE" to confirm</Label>
                        <Input
                          id="delete-confirm"
                          required
                          className="border-gray-200 focus:border-[#8A70D6] focus:ring-[#8A70D6]"
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
