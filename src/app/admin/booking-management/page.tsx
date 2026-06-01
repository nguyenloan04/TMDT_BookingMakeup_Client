import React from "react"
import { Search, Filter, Edit, Trash2, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

const mockBookings = [
  { id: "BK-1001", customer: "Nguyen Van A", artist: "Tran Thi B", date: "2026-06-05", time: "09:00 AM", status: "CONFIRMED", amount: "$120.00", service: "Bridal Makeup" },
  { id: "BK-1002", customer: "Le Thi C", artist: "Hoang Van E", date: "2026-06-05", time: "11:30 AM", status: "PENDING", amount: "$85.00", service: "Event Makeup" },
  { id: "BK-1003", customer: "Pham Minh D", artist: "Tran Thi B", date: "2026-06-02", time: "14:00 PM", status: "COMPLETED", amount: "$150.00", service: "Photoshoot" },
  { id: "BK-1004", customer: "Hoang Anh T", artist: "Ly Nha K", date: "2026-06-08", time: "10:00 AM", status: "CANCELLED", amount: "$90.00", service: "Party Makeup" },
  { id: "BK-1005", customer: "Vu Nhu Y", artist: "Tran Thi B", date: "2026-06-10", time: "08:00 AM", status: "CONFIRMED", amount: "$200.00", service: "Bridal Package" },
]

export default function BookingManagementPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor and manage customer appointments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 rounded-xl h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 border-0">
            <CalendarDays className="h-4 w-4" />
            Manual Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">28</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">145</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelled</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">7</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID or customer..." 
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-violet-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300 h-12 w-[100px]">ID</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Customer & Service</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Artist</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Schedule</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Amount</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                      {booking.id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{booking.customer}</span>
                        <span className="text-xs text-slate-500">{booking.service}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {booking.artist.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{booking.artist}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-slate-700 dark:text-slate-300 gap-1.5">
                          <CalendarDays className="h-3 w-3 text-slate-400" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 gap-1.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {booking.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          booking.status === 'COMPLETED' ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                          booking.status === 'CONFIRMED' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:bg-blue-900/10' :
                          booking.status === 'PENDING' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/10' :
                          'border-red-200 text-red-700 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/10'
                        }
                      >
                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          booking.status === 'COMPLETED' ? 'bg-green-500' :
                          booking.status === 'CONFIRMED' ? 'bg-blue-500' : 
                          booking.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      {booking.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
