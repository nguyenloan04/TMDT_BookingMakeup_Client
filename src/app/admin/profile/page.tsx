import React from "react"
import { Camera, Edit3, Shield, CreditCard, Bell, Key, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfileManagementPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal information and preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 rounded-xl h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 border-0">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-emerald-400 to-teal-500 w-full absolute top-0 left-0"></div>
            <CardContent className="pt-12 pb-6 px-6 relative z-10 flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-950 p-1 shadow-md">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500 dark:text-slate-400 overflow-hidden relative">
                    <span className="z-0">A</span>
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 text-center">Admin User</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-3">admin@bookingbeauty.com</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">System Administrator</Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <button className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-left text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <Edit3 className="h-5 w-5" />
                  <span className="font-medium text-sm">Personal Info</span>
                </button>
                <button className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-left text-slate-600 dark:text-slate-400 border-l-2 border-transparent">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium text-sm">Security</span>
                </button>
                <button className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors text-left text-slate-600 dark:text-slate-400 border-l-2 border-transparent">
                  <Bell className="h-5 w-5" />
                  <span className="font-medium text-sm">Notifications</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-full">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                  <Input defaultValue="Admin" className="rounded-xl h-11" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                  <Input defaultValue="User" className="rounded-xl h-11" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <Input defaultValue="admin@bookingbeauty.com" type="email" className="rounded-xl h-11" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <Input defaultValue="+84 123 456 789" className="rounded-xl h-11" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                  <Input defaultValue="Ho Chi Minh City, VN" className="rounded-xl h-11" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                      <Input type="password" placeholder="••••••••" className="rounded-xl h-11" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                      <Input type="password" placeholder="••••••••" className="rounded-xl h-11" />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
