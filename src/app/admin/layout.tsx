import React from "react"
import Link from "next/link"
import { Users, Tag, CalendarDays, LayoutDashboard, Settings, LogOut, UserCircle, Sparkles, Star } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 sm:flex transition-all duration-300">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <CalendarDays className="h-6 w-6" />
            </div>
            BookingBeauty
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 flex flex-col gap-1 px-4">
          <nav className="grid gap-2 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/user-management"
              className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-primary transition-all hover:bg-primary/20"
            >
              <Users className="h-5 w-5" />
              User Management
            </Link>
            <Link
              href="/admin/promotion-management"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <Tag className="h-5 w-5" />
              Promotion Management
            </Link>
            <Link
              href="/admin/booking-management"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <CalendarDays className="h-5 w-5" />
              Booking Management
            </Link>
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <UserCircle className="h-5 w-5" />
              Profile Management
            </Link>
            <Link
              href="/admin/service-management"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <Sparkles className="h-5 w-5" />
              Service Management
            </Link>
            <Link
              href="/admin/review-management"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <Star className="h-5 w-5" />
              Review Management
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <nav className="grid gap-2 text-sm font-medium">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <button
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/50 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 flex-1 w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile menu toggle could go here */}
          <div className="flex-1 font-semibold text-lg">Admin Portal</div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 shadow-sm border-2 border-white dark:border-slate-800"></div>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
