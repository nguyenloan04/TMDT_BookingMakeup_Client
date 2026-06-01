import React from "react"
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react"
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

const mockUsers = [
  { id: "1", name: "Nguyen Van A", email: "vana@example.com", role: "CUSTOMER", status: "ACTIVE", date: "2026-06-01" },
  { id: "2", name: "Tran Thi B", email: "tranb@example.com", role: "MAKEUP_ARTIST", status: "ACTIVE", date: "2026-05-28" },
  { id: "3", name: "Le Van C", email: "levanc@example.com", role: "ADMIN", status: "ACTIVE", date: "2026-05-20" },
  { id: "4", name: "Pham Thi D", email: "phamd@example.com", role: "CUSTOMER", status: "INACTIVE", date: "2026-05-15" },
  { id: "5", name: "Hoang Van E", email: "hoange@example.com", role: "MAKEUP_ARTIST", status: "PENDING", date: "2026-05-10" },
]

export default function UserManagementPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your users, roles, and platform access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 rounded-xl h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground shadow-lg shadow-primary/20 border-0">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">All Users</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300 h-12">User Details</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Role</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Joined Date</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center font-bold text-sm text-primary ring-2 ring-white dark:ring-slate-950 shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-slate-100">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800' :
                          user.role === 'MAKEUP_ARTIST' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                          'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          user.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                          user.status === 'PENDING' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/10' :
                          'border-red-200 text-red-700 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/10'
                        }
                      >
                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-500' :
                          user.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{user.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10">
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
