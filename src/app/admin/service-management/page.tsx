import React from "react"
import { Search, Plus, Filter, Edit, Trash2, Sparkles, Wand2, Star, Clock } from "lucide-react"
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

const mockServices = [
  { id: "SRV-01", name: "Bridal Makeup Full Package", category: "Wedding", price: "$250.00", duration: "180 min", status: "ACTIVE", rating: "4.9" },
  { id: "SRV-02", name: "Party Evening Glam", category: "Event", price: "$80.00", duration: "60 min", status: "ACTIVE", rating: "4.7" },
  { id: "SRV-03", name: "Photoshoot Editorial", category: "Commercial", price: "$150.00", duration: "120 min", status: "ACTIVE", rating: "4.8" },
  { id: "SRV-04", name: "Basic Daily Makeup", category: "Daily", price: "$45.00", duration: "45 min", status: "INACTIVE", rating: "4.2" },
  { id: "SRV-05", name: "Halloween Special FX", category: "Special", price: "$120.00", duration: "90 min", status: "ACTIVE", rating: "5.0" },
]

export default function ServiceManagementPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure makeup services, pricing, and categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 rounded-xl h-10 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 border-0">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
                <Wand2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Services</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">34</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Service Catalog</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search services..." 
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300 h-12">Service Name</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Category</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Price</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Duration</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockServices.map((service) => (
                  <TableRow key={service.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 ring-1 ring-amber-100 dark:ring-amber-900/30">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{service.name}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-slate-500 font-medium">{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      {service.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          service.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                          'border-slate-200 text-slate-500 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800/50'
                        }
                      >
                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          service.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400'
                        }`} />
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
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
