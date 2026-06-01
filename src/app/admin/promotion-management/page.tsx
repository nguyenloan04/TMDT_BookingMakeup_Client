import React from "react"
import { Search, Plus, Filter, Edit, Trash2, Ticket, Calendar as CalendarIcon, Percent } from "lucide-react"
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

const mockPromotions = [
  { id: "1", code: "SUMMER26", type: "PERCENTAGE", value: "20%", minOrder: "$50", status: "ACTIVE", validUntil: "2026-08-31", usage: "145/500" },
  { id: "2", code: "NEWUSER50", type: "FIXED_AMOUNT", value: "$10", minOrder: "$30", status: "ACTIVE", validUntil: "2026-12-31", usage: "89/Unlimited" },
  { id: "3", code: "FLASHMAY", type: "PERCENTAGE", value: "15%", minOrder: "$0", status: "EXPIRED", validUntil: "2026-05-31", usage: "300/300" },
  { id: "4", code: "BRIDALPRO", type: "FIXED_AMOUNT", value: "$50", minOrder: "$200", status: "ACTIVE", validUntil: "2026-09-15", usage: "12/50" },
  { id: "5", code: "WEEKEND", type: "PERCENTAGE", value: "10%", minOrder: "$20", status: "SCHEDULED", validUntil: "2026-06-05", usage: "0/100" },
]

export default function PromotionManagementPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotion Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create and manage discount codes and special offers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 rounded-xl h-10 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/20 border-0">
            <Plus className="h-4 w-4" />
            Create Promotion
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <Card className="border-none shadow-sm bg-gradient-to-br from-pink-500/10 to-rose-500/5 dark:from-pink-900/20 dark:to-rose-900/10 border border-pink-100 dark:border-pink-900/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/50 rounded-xl text-pink-600 dark:text-pink-400">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Promotions</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Discounted</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">$1,450.00</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Campaign List</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search code..." 
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-pink-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300 h-12">Promo Code</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Discount</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Min Order</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Usage</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Valid Until</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPromotions.map((promo) => (
                  <TableRow key={promo.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100 tracking-wide bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm border border-slate-200 dark:border-slate-700 border-dashed w-fit">{promo.code}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-pink-600 dark:text-pink-400">
                        {promo.value}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{promo.minOrder}</TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{promo.usage}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          promo.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                          promo.status === 'SCHEDULED' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:bg-blue-900/10' :
                          'border-slate-200 text-slate-500 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800/50'
                        }
                      >
                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          promo.status === 'ACTIVE' ? 'bg-green-500' :
                          promo.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-slate-400'
                        }`} />
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm flex items-center gap-2 mt-2.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {promo.validUntil}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20">
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
