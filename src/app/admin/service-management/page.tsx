"use client";

import React, { useEffect, useState } from "react"
import { Search, Plus, Filter, Edit, Trash2, Sparkles, Wand2, Star, Clock, X, Loader2 } from "lucide-react"
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
import { toast } from "sonner"
import { 
  ManagementServiceDto, 
  getAllServices, 
  createService, 
  updateService, 
  deleteService, 
  CreateServiceRequest 
} from "@/services/management-service"
import axios from "axios"

export default function ServiceManagementPage() {
  const [services, setServices] = useState<ManagementServiceDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    isActive: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const data = await getAllServices()
      setServices(data)
    } catch (error) {
      toast.error("Lỗi khi tải danh sách dịch vụ")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData({ name: "", category: "", price: "", duration: "", description: "", isActive: true })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (service: ManagementServiceDto) => {
    setEditingId(service.id)
    setFormData({ 
      name: service.name, 
      category: service.category || "", 
      price: service.price.toString(), 
      duration: service.duration ? service.duration.toString() : "", 
      description: service.description || "",
      isActive: service.isActive
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá dịch vụ này không?")) return
    
    try {
      await deleteService(id)
      toast.success("Đã xoá dịch vụ")
      fetchServices()
    } catch (error) {
      toast.error("Lỗi khi xoá dịch vụ")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description,
        isActive: formData.isActive
      }

      if (editingId) {
        await updateService(editingId, payload)
        toast.success("Cập nhật dịch vụ thành công")
      } else {
        await createService(payload as CreateServiceRequest)
        toast.success("Thêm dịch vụ thành công")
      }
      
      setIsModalOpen(false)
      fetchServices()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Thao tác thất bại", { description: error.response.data || "" })
      } else {
        toast.error("Đã xảy ra lỗi")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure makeup services, pricing, and categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm" onClick={fetchServices}>
            <Filter className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleOpenAddModal}
            className="gap-2 rounded-xl h-10 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 border-0"
          >
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{services.length}</h3>
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
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-amber-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : (
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
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No services found
                      </TableCell>
                    </TableRow>
                  ) : filteredServices.map((service) => (
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
                              <span className="text-xs text-slate-500 font-medium">{service.rating?.toFixed(1) || "0.0"}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                          {service.category || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        ${service.price?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {service.duration ? `${service.duration} min` : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            service.isActive ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                            'border-slate-200 text-slate-500 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800/50'
                          }
                        >
                          <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            service.isActive ? 'bg-green-500' : 'bg-slate-400'
                          }`} />
                          {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => handleOpenEditModal(service)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDelete(service.id)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold">{editingId ? "Edit Service" : "Add New Service"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium">Service Name *</label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Bridal Makeup" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    placeholder="e.g. Wedding" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Price ($) *</label>
                  <Input 
                    required 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    placeholder="0.00" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Duration (minutes) *</label>
                  <Input 
                    required 
                    type="number" 
                    min="1"
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})} 
                    placeholder="60" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
                    value={formData.isActive ? "true" : "false"}
                    onChange={e => setFormData({...formData, isActive: e.target.value === "true"})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Describe the service..." 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-white">
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editingId ? "Save Changes" : "Create Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
