"use client";

import React, { useEffect, useState } from "react"
import { Search, Filter, Trash2, Star, MessageSquareQuote, CheckCircle2, XCircle, Loader2 } from "lucide-react"
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
import { ReviewDto, getAllReviews, updateReviewStatus, deleteReview } from "@/services/review-service"

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<ReviewDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getAllReviews()
      setReviews(data)
    } catch (error) {
      toast.error("Không thể tải danh sách đánh giá")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateReviewStatus(id, newStatus)
      toast.success(`Đã cập nhật trạng thái thành ${newStatus}`)
      fetchReviews()
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đánh giá này?")) return
    try {
      await deleteReview(id)
      toast.success("Đã xoá đánh giá")
      fetchReviews()
    } catch (error) {
      toast.error("Xoá đánh giá thất bại")
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;
  const pendingCount = reviews.filter(r => r.status === 'PENDING').length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor and moderate customer reviews and feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-10 shadow-sm" onClick={fetchReviews}>
            <Filter className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reviews</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{reviews.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Rating</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{avgRating}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Approved</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{approvedCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{pendingCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Review Feed</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search reviews or customers..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-950 rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-blue-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300 w-[200px] h-12">Customer & Service</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300 w-[120px]">Rating</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300 max-w-[300px]">Comment</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Date</TableHead>
                    <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Status</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-300 w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No reviews found
                      </TableCell>
                    </TableRow>
                  ) : filteredReviews.map((review) => (
                    <TableRow key={review.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                      <TableCell className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{review.customer}</span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md w-fit">
                            {review.service}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= review.rating 
                                  ? "text-amber-400 fill-amber-400" 
                                  : "text-slate-200 dark:text-slate-700"
                              }`} 
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                          "{review.comment}"
                        </p>
                      </TableCell>
                      <TableCell className="align-top whitespace-nowrap text-slate-500 text-sm">
                        <span className="mt-1 block">{review.date}</span>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${
                            review.status === 'APPROVED' ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10' :
                            review.status === 'PENDING' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/10' :
                            'border-red-200 text-red-700 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/10'
                          }`}
                        >
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {review.status !== 'APPROVED' && (
                            <Button 
                              onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" 
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          {review.status !== 'REJECTED' && (
                            <Button 
                              onClick={() => handleUpdateStatus(review.id, 'REJECTED')}
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleDelete(review.id)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" 
                            title="Delete"
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
    </div>
  )
}
