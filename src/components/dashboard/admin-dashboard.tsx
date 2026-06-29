"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Loader2,
  Check,
  X,
  CheckCircle,
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  Package,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getMyBookings,
  updateBookingStatus,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getAllFavouritesAdmin,
  deleteFavouriteAdmin,
  FavouriteAdminDto,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "@/lib/api";

import { UserDto } from "@/types/user";
import { BookingDto, BookingStatus } from "@/types/booking";
import { PromotionDto } from "@/types/promotion";
import { ReviewDto } from "@/types/review";

type AdminTab =
  | "stats"
  | "orderStats"
  | "users"
  | "bookings"
  | "promotions"
  | "favorites"
  | "reviews";

const tabButtonClass = (active: boolean) =>
  `pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
    active
      ? "border-[#E4187D] text-[#E4187D]"
      : "border-transparent text-gray-500 hover:text-gray-900"
  }`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("stats");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingPromotions, setLoadingPromotions] = useState(false);

  const [users, setUsers] = useState<UserDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavouriteAdminDto[]>([]);
  const [favoriteSearchQuery, setFavoriteSearchQuery] = useState("");

  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "REJECTED">("ALL");

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionDto | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(10000);
  const [promoMinOrder, setPromoMinOrder] = useState(50000);
  const [promoPointCharge, setPromoPointCharge] = useState(0);
  const [promoExpiry, setPromoExpiry] = useState("");
  const [savingPromo, setSavingPromo] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    fetchPromotionsList();
    fetchFavorites();
    fetchReviewsList();
  }, []);

  const getErrorMessage = (e: any, fallback: string): string => {
    if (e.response?.data) {
      if (typeof e.response.data === "string") {
        return e.response.data;
      }
      if (typeof e.response.data === "object") {
        return e.response.data.message || e.response.data.error || fallback;
      }
    }
    return e.message || fallback;
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const list = await getMyBookings();
      setBookings(list);
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchPromotionsList = async () => {
    setLoadingPromotions(true);
    try {
      const list = await getPromotions();
      setPromotions(list);
    } catch {
      toast.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoadingPromotions(false);
    }
  };

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const list = await getAllFavouritesAdmin();
      setFavorites(list || []);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ yêu thích");
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleDeleteFavorite = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa liên kết yêu thích này?")) return;
    try {
      await deleteFavouriteAdmin(id);
      toast.success("Xóa liên kết yêu thích thành công!");
      fetchFavorites();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Không thể xóa liên kết yêu thích"));
    }
  };

  const fetchReviewsList = async () => {
    setLoadingReviews(true);
    try {
      const list = await getAllReviews();
      setReviews(list || []);
    } catch {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleUpdateReviewStatus = async (
    id: string,
    status: "APPROVED" | "PENDING" | "REJECTED",
  ) => {
    try {
      await updateReviewStatus(id, status);
      toast.success("Cập nhật trạng thái đánh giá thành công!");
      fetchReviewsList();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Không thể cập nhật trạng thái"));
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
    try {
      await deleteReview(id);
      toast.success("Xóa đánh giá thành công!");
      fetchReviewsList();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Không thể xóa đánh giá"));
    }
  };

  const handleOpenAddPromo = () => {
    setEditingPromo(null);
    setPromoCode("");
    setPromoDiscount(10000);
    setPromoMinOrder(50000);
    setPromoPointCharge(0);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setPromoExpiry(nextWeek.toISOString().slice(0, 16));
    setPromoModalOpen(true);
  };

  const handleOpenEditPromo = (promo: PromotionDto) => {
    setEditingPromo(promo);
    setPromoCode(promo.code);
    setPromoDiscount(promo.discountValue);
    setPromoMinOrder(promo.minOrderValue);
    setPromoPointCharge(promo.pointCharge || 0);
    setPromoExpiry(promo.expiryDate.slice(0, 16));
    setPromoModalOpen(true);
  };

  const handleSavePromo = async () => {
    if (
      !promoCode.trim() ||
      promoDiscount <= 0 ||
      promoMinOrder < 0 ||
      !promoExpiry
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin mã giảm giá");
      return;
    }
    setSavingPromo(true);
    try {
      const formattedExpiry = new Date(promoExpiry).toISOString();
      if (editingPromo) {
        await updatePromotion(editingPromo.id, {
          discountValue: promoDiscount,
          minOrderValue: promoMinOrder,
          pointCharge: promoPointCharge,
          expiryDate: formattedExpiry,
        });
        toast.success("Cập nhật khuyến mãi thành công!");
      } else {
        await createPromotion({
          code: promoCode.trim().toUpperCase(),
          discountValue: promoDiscount,
          minOrderValue: promoMinOrder,
          pointCharge: promoPointCharge,
          expiryDate: formattedExpiry,
        });
        toast.success("Tạo khuyến mãi thành công!");
      }
      setPromoModalOpen(false);
      fetchPromotionsList();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Thao tác thất bại"));
    } finally {
      setSavingPromo(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      await deletePromotion(id);
      toast.success("Xóa mã giảm giá thành công!");
      fetchPromotionsList();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Không thể xóa khuyến mãi"));
    }
  };

  const handleToggleUserStatus = async (id: string, currentActive: boolean) => {
    setUpdatingUserId(id);
    try {
      await updateUserStatus(id, !currentActive);
      toast.success(
        currentActive
          ? "Đã khóa tài khoản người dùng"
          : "Đã mở khóa tài khoản người dùng",
      );
      fetchUsers();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Thao tác thất bại"));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleUserRole = async (
    id: string,
    currentRole: string | number,
  ) => {
    setUpdatingUserId(id);
    const newRole =
      currentRole === "ADMIN" || currentRole === 1 ? "USER" : "ADMIN";
    try {
      await updateUserRole(id, newRole);
      toast.success(`Đã thay đổi vai trò tài khoản thành: ${newRole}`);
      fetchUsers();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Thao tác thất bại"));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
  ) => {
    setUpdatingBookingId(bookingId);
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Cập nhật trạng thái đơn hàng thành: ${status}`);
      fetchBookings();
    } catch (e: any) {
      toast.error(getErrorMessage(e, "Không thể cập nhật trạng thái"));
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  const filteredFavorites = useMemo(() => {
    return favorites.filter(fav => {
      const query = favoriteSearchQuery.toLowerCase();
      return (
        (fav.customerName || "").toLowerCase().includes(query) ||
        (fav.customerEmail || "").toLowerCase().includes(query) ||
        (fav.serviceName || "").toLowerCase().includes(query) ||
        (fav.artistName || "").toLowerCase().includes(query)
      );
    });
  }, [favorites, favoriteSearchQuery]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      const matchesSearch = 
        (rev.customer || "").toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
        (rev.service || "").toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
        (rev.comment || "").toLowerCase().includes(reviewSearchQuery.toLowerCase());
        
      const matchesStatus = 
        reviewStatusFilter === "ALL" || rev.status === reviewStatusFilter;
        
      return matchesSearch && matchesStatus;
    });
  }, [reviews, reviewSearchQuery, reviewStatusFilter]);

  const bookingStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ Xác Nhận";
      case "CONFIRMED":
        return "Đã Xác Nhận";
      case "COMPLETED":
        return "Đã Hoàn Thành";
      case "CANCELLED":
        return "Đã Hủy";
    }
  };

  const bookingStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-none";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-none";
      default:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none";
    }
  };

  const orderStats = useMemo(() => {
    const statusCounts: Record<BookingStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    const serviceMap = new Map<string, { name: string; count: number }>();
    const customerMap = new Map<string, { name: string; count: number }>();

    for (const booking of bookings) {
      statusCounts[booking.status]++;
      const service = serviceMap.get(booking.serviceId) ?? {
        name: booking.serviceName,
        count: 0,
      };
      service.count += 1;
      serviceMap.set(booking.serviceId, service);

      const customer = customerMap.get(booking.customerId) ?? {
        name: booking.customerDisplayName || "Khách hàng",
        count: 0,
      };
      customer.count += 1;
      customerMap.set(booking.customerId, customer);
    }

    const topServices = [...serviceMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const topCustomers = [...customerMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: bookings.length,
      statusCounts,
      uniqueCustomers: customerMap.size,
      topServices,
      topCustomers,
      completionRate:
        bookings.length > 0
          ? Math.round((statusCounts.COMPLETED / bookings.length) * 100)
          : 0,
      cancellationRate:
        bookings.length > 0
          ? Math.round((statusCounts.CANCELLED / bookings.length) * 100)
          : 0,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("stats")}
          className={tabButtonClass(activeTab === "stats")}
        >
          Thống Kê Doanh Thu
        </button>
        <button
          onClick={() => setActiveTab("orderStats")}
          className={tabButtonClass(activeTab === "orderStats")}
        >
          Thống Kê Đơn Hàng ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={tabButtonClass(activeTab === "users")}
        >
          Quản Lý Người Dùng ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={tabButtonClass(activeTab === "bookings")}
        >
          Quản Lý Đơn Hàng ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("promotions")}
          className={tabButtonClass(activeTab === "promotions")}
        >
          Mã Khuyến Mãi ({promotions.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={tabButtonClass(activeTab === "favorites")}
        >
          Quản Lý Dịch Vụ Ưu Thích
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={tabButtonClass(activeTab === "reviews")}
        >
          Đánh Giá
        </button>
      </div>

      {/* TAB: REVENUE STATS (placeholder) */}
      {activeTab === "stats" && null}

      {/* TAB: ORDER STATS */}
      {activeTab === "orderStats" && (
        <div className="space-y-4">
          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải thống kê đơn hàng...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <h3 className="font-bold text-gray-900">
                  Tổng quan đơn hàng toàn hệ thống
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Thống kê tổng hợp từ bảng bookings — cập nhật theo dữ liệu
                  thực tế.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <Package className="w-4 h-4 text-[#E4187D]" />
                    Tổng đơn
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {orderStats.total}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    Chờ xác nhận
                  </div>
                  <p className="text-2xl font-extrabold text-yellow-600">
                    {orderStats.statusCounts.PENDING}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Đã xác nhận
                  </div>
                  <p className="text-2xl font-extrabold text-green-600">
                    {orderStats.statusCounts.CONFIRMED}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Hoàn thành
                  </div>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {orderStats.statusCounts.COMPLETED}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Đã hủy
                  </div>
                  <p className="text-2xl font-extrabold text-red-600">
                    {orderStats.statusCounts.CANCELLED}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                    <Users className="w-4 h-4 text-[#E4187D]" />
                    Khách hàng
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {orderStats.uniqueCustomers}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#E4187D]" />
                    <h4 className="font-bold text-gray-900">
                      Phân bổ trạng thái đơn hàng
                    </h4>
                  </div>
                  {orderStats.total === 0 ? (
                    <p className="text-sm text-gray-400">
                      Chưa có dữ liệu đơn hàng.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(
                        [
                          ["PENDING", "Chờ xác nhận", "bg-yellow-400"],
                          ["CONFIRMED", "Đã xác nhận", "bg-green-500"],
                          ["COMPLETED", "Hoàn thành", "bg-blue-500"],
                          ["CANCELLED", "Đã hủy", "bg-red-500"],
                        ] as const
                      ).map(([status, label, barClass]) => {
                        const count = orderStats.statusCounts[status];
                        const percent = Math.round(
                          (count / orderStats.total) * 100,
                        );
                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-gray-600">
                              <span>{label}</span>
                              <span>
                                {count} ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barClass}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Tỷ lệ hoàn thành</p>
                      <p className="font-bold text-blue-600">
                        {orderStats.completionRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Tỷ lệ hủy</p>
                      <p className="font-bold text-red-600">
                        {orderStats.cancellationRate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-900">
                    Dịch vụ được đặt nhiều nhất
                  </h4>
                  {orderStats.topServices.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Chưa có dữ liệu dịch vụ.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {orderStats.topServices.map((svc, index) => (
                        <div
                          key={svc.name}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-[#E4187D]/10 text-[#E4187D] text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {svc.name}
                            </span>
                          </div>
                          <Badge className="bg-white text-gray-700 border border-gray-200 hover:bg-white shrink-0">
                            {svc.count} đơn
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900">
                  Khách hàng đặt nhiều nhất
                </h4>
                {orderStats.topCustomers.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Chưa có dữ liệu khách hàng.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                          <th className="p-3 border-b border-gray-100">#</th>
                          <th className="p-3 border-b border-gray-100">
                            Khách hàng
                          </th>
                          <th className="p-3 border-b border-gray-100 text-right">
                            Số đơn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {orderStats.topCustomers.map((customer, index) => (
                          <tr key={customer.name + index}>
                            <td className="p-3 text-gray-400">{index + 1}</td>
                            <td className="p-3 font-medium text-gray-900">
                              {customer.name}
                            </td>
                            <td className="p-3 text-right font-bold text-[#E4187D]">
                              {customer.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: FAVORITE SERVICES MANAGEMENT */}
      {activeTab === "favorites" && (
        <div className="space-y-4">
          {loadingFavorites ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải danh sách dịch vụ yêu thích...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Quản lý dịch vụ yêu thích ({favorites.length})
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Theo dõi và xóa các liên kết dịch vụ yêu thích của người dùng trên hệ thống.
                  </p>
                </div>
                {/* Search Box */}
                <div className="relative w-full sm:w-72">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <Input
                    placeholder="Tìm khách hàng, email, dịch vụ..."
                    className="pl-9 rounded-full text-xs"
                    value={favoriteSearchQuery}
                    onChange={(e) => setFavoriteSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredFavorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
                  <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    Không tìm thấy kết quả nào
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {favorites.length === 0 
                      ? "Chưa có người dùng nào thêm dịch vụ vào danh sách yêu thích." 
                      : "Không có liên kết yêu thích nào khớp với từ khóa tìm kiếm."}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th className="p-4 border-b border-gray-100">Khách Hàng</th>
                        <th className="p-4 border-b border-gray-100">Dịch Vụ Yêu Thích</th>
                        <th className="p-4 border-b border-gray-100">Nghệ Sĩ / Studio</th>
                        <th className="p-4 border-b border-gray-100 text-right">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {filteredFavorites.map((fav) => (
                        <tr
                          key={fav.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-bold text-gray-900">
                              {fav.customerName}
                            </div>
                            <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                              {fav.customerEmail}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#E4187D]">
                              {fav.serviceName}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Giá: {formatPrice(fav.servicePrice)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                              {fav.artistName}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFavorite(fav.id)}
                              className="text-xs rounded-full cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xóa
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB: REVIEWS MANAGEMENT */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {loadingReviews ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải danh sách đánh giá...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Quản lý đánh giá hệ thống ({reviews.length})
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Kiểm duyệt, phê duyệt, ẩn hoặc xóa nhận xét từ khách hàng.
                  </p>
                </div>
                
                {/* Search & Status Pills in header */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
                  <div className="relative w-full sm:w-64 shrink-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <Input
                      placeholder="Tìm khách hàng, dịch vụ, nội dung..."
                      className="pl-9 rounded-full text-xs"
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none">
                    {[
                      { value: "ALL", label: "Tất cả" },
                      { value: "PENDING", label: "Chờ duyệt" },
                      { value: "APPROVED", label: "Đã duyệt" },
                      { value: "REJECTED", label: "Đã ẩn" },
                    ].map((pill) => {
                      const isActive = reviewStatusFilter === pill.value;
                      const count = pill.value === "ALL" 
                        ? reviews.length 
                        : reviews.filter((r) => r.status === pill.value).length;
                      return (
                        <button
                          key={pill.value}
                          onClick={() => setReviewStatusFilter(pill.value as any)}
                          className={`rounded-full text-xs px-3.5 py-1.5 font-semibold transition-all shrink-0 cursor-pointer ${
                            isActive 
                              ? "bg-[#E4187D] text-white shadow-xs" 
                              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pill.label} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto space-y-4">
                  <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
                    <MessageSquare className="w-10 h-10 text-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Không tìm thấy đánh giá nào
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      {reviews.length === 0 
                        ? "Hệ thống chưa nhận được bất kỳ đánh giá nào từ người dùng." 
                        : "Không có đánh giá nào khớp với tiêu chí bộ lọc hiện tại."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">
                              {rev.customer}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              📅 {rev.date}
                            </span>
                          </div>
                          <Badge
                            className={
                              rev.status === "APPROVED"
                                ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200 border text-xs"
                                : rev.status === "REJECTED"
                                  ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 border text-xs"
                                  : "bg-yellow-50 text-yellow-750 hover:bg-yellow-50 border-yellow-250 border text-xs"
                            }
                          >
                            {rev.status === "APPROVED"
                              ? "Đã Duyệt"
                              : rev.status === "REJECTED"
                                ? "Đã Ẩn"
                                : "Chờ Duyệt"}
                          </Badge>
                        </div>

                        <div>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                            Dịch vụ đánh giá
                          </span>
                          <span className="font-bold text-[#E4187D] text-sm block mt-0.5">
                            {rev.service}
                          </span>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-450 font-bold font-mono">
                            {rev.rating.toFixed(1)} / 5
                          </span>
                        </div>

                        {/* Comment box */}
                        <p className="text-xs text-gray-600 italic bg-gray-50/50 p-3 rounded-xl border border-gray-100/50 leading-relaxed font-normal">
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <div className="flex gap-1.5">
                          {rev.status !== "APPROVED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateReviewStatus(rev.id, "APPROVED")}
                              className="text-xs rounded-full border-green-200 text-green-600 hover:bg-green-50 px-3 cursor-pointer"
                            >
                              Phê Duyệt
                            </Button>
                          )}
                          {rev.status !== "REJECTED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateReviewStatus(rev.id, "REJECTED")}
                              className="text-xs rounded-full border-red-200 text-red-600 hover:bg-red-50 px-3 cursor-pointer"
                            >
                              Ẩn Đi
                            </Button>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-xs text-gray-450 hover:text-red-500 hover:bg-red-50 rounded-full p-2 cursor-pointer"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB: REVIEWS (placeholder) */}
      {activeTab === "reviews" && null}

      {/* TAB: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải danh sách người dùng...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <h3 className="font-bold text-gray-900">
                  Danh mục quản lý người dùng ({users.length})
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Phân quyền, kiểm duyệt hoặc đình chỉ tài khoản người dùng hệ
                  thống.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="p-4 border-b border-gray-100">
                        Tên Đăng Nhập
                      </th>
                      <th className="p-4 border-b border-gray-100">Email</th>
                      <th className="p-4 border-b border-gray-100">Vai Trò</th>
                      <th className="p-4 border-b border-gray-100">
                        Trạng Thái
                      </th>
                      <th className="p-4 border-b border-gray-100 text-right">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-bold text-gray-900">
                            {u.displayName || u.username}
                          </div>
                          <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                            ID: {u.id}
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              u.role === "ADMIN" || u.role === 1
                                ? "bg-red-100 text-red-700 hover:bg-red-100 border-none"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-none"
                            }
                          >
                            {u.role === "ADMIN" || u.role === 1
                              ? "ADMIN"
                              : "USER"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              u.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"
                            }
                          >
                            {u.isActive ? "Hoạt động" : "Đã khóa"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            {updatingUserId === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#E4187D]" />
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleUserRole(u.id, u.role)
                                  }
                                  className="text-xs rounded-full border-gray-200 hover:bg-gray-50 cursor-pointer"
                                >
                                  {u.role === "ADMIN" || u.role === 1
                                    ? "Hạ USER"
                                    : "Lên ADMIN"}
                                </Button>
                                <Button
                                  variant={u.isActive ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() =>
                                    handleToggleUserStatus(u.id, u.isActive)
                                  }
                                  className={`text-xs rounded-full cursor-pointer ${
                                    !u.isActive
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : ""
                                  }`}
                                >
                                  {u.isActive ? "Khóa" : "Mở Khóa"}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: ORDER MANAGEMENT */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải danh sách đơn hàng...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <h3 className="font-bold text-gray-900">
                  Danh sách đơn hàng toàn hệ thống ({bookings.length})
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Theo dõi và quản lý tất cả các đơn đặt lịch trên nền tảng.
                </p>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    Chưa có đơn hàng nào
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Các đơn đặt lịch từ khách hàng sẽ hiển thị tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-lg">
                            {booking.serviceName}
                          </span>
                          <Badge
                            className={bookingStatusBadgeClass(booking.status)}
                          >
                            {bookingStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500">
                          <p>
                            Khách:{" "}
                            <span className="font-medium text-gray-700">
                              {booking.customerDisplayName || "Chưa cập nhật"}
                            </span>
                          </p>
                          <p>
                            Artist:{" "}
                            <span className="font-medium text-gray-700">
                              {booking.artistName}
                            </span>
                          </p>
                          <p>
                            ⏱ Khung giờ: {booking.startTime.slice(0, 5)} -{" "}
                            {booking.endTime.slice(0, 5)}
                          </p>
                          <p>
                            📅 Ngày hẹn:{" "}
                            {booking.bookingDate.split("-").reverse().join("/")}
                          </p>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <p>
                            Tổng tiền:{" "}
                            <span className="font-semibold text-gray-700">
                              {formatPrice(booking.totalAmount)}
                            </span>
                          </p>
                          <p>
                            Khách đã cọc:{" "}
                            <span className="font-semibold text-pink-600">
                              {formatPrice(booking.depositAmount)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap w-full md:w-auto self-end md:self-center shrink-0">
                        {updatingBookingId === booking.id ? (
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold py-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#E4187D]" />
                            Đang lưu...
                          </div>
                        ) : (
                          <>
                            {booking.status === "PENDING" && (
                              <>
                                <Button
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "CONFIRMED",
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold px-4 py-2 cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Xác Nhận
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "CANCELLED",
                                    )
                                  }
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full text-xs font-bold px-4 py-2 cursor-pointer flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" /> Hủy
                                </Button>
                              </>
                            )}
                            {booking.status === "CONFIRMED" && (
                              <>
                                <Button
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "COMPLETED",
                                    )
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold px-4 py-2 cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Hoàn
                                  Thành
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "CANCELLED",
                                    )
                                  }
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full text-xs font-bold px-4 py-2 cursor-pointer flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" /> Hủy
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB: PROMOTION MANAGEMENT */}
      {activeTab === "promotions" && (
        <div className="space-y-4">
          {loadingPromotions ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
              <p className="text-gray-400 text-sm">
                Đang tải danh sách khuyến mãi...
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Mã khuyến mãi hệ thống ({promotions.length})
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Quản lý các coupon do Admin tạo (owner_id = null).
                  </p>
                </div>
                <Button
                  onClick={handleOpenAddPromo}
                  className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full font-semibold cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Tạo Coupon
                </Button>
              </div>

              {promotions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
                  <Tag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    Chưa có mã giảm giá nào
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Tạo mã giảm giá để khách hàng sử dụng khi đặt lịch.
                  </p>
                  <Button
                    onClick={handleOpenAddPromo}
                    className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full"
                  >
                    Tạo mã đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th className="p-4 border-b border-gray-100">Mã Code</th>
                        <th className="p-4 border-b border-gray-100">
                          Giá Trị Giảm
                        </th>
                        <th className="p-4 border-b border-gray-100">
                          Đơn Tối Thiểu
                        </th>
                        <th className="p-4 border-b border-gray-100">Điểm Đổi</th>
                        <th className="p-4 border-b border-gray-100">
                          Hạn Sử Dụng
                        </th>
                        <th className="p-4 border-b border-gray-100 text-right">
                          Thao Tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {promotions.map((promo) => (
                        <tr
                          key={promo.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-pink-600 text-base">
                            {promo.code}
                          </td>
                          <td className="p-4 text-[#E4187D] font-extrabold">
                            {formatPrice(promo.discountValue)}
                          </td>
                          <td className="p-4">
                            {formatPrice(promo.minOrderValue)}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">
                              {promo.pointCharge || 0} điểm
                            </Badge>
                          </td>
                          <td className="p-4 text-xs text-gray-500">
                            {new Date(promo.expiryDate).toLocaleString("vi-VN")}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleOpenEditPromo(promo)}
                                className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-600 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="p-1.5 hover:bg-red-50 border border-gray-100 rounded-lg text-red-600 hover:border-red-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PROMO MODAL */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPromo ? "Chỉnh Sửa Coupon" : "Tạo Mã Coupon Mới"}
              </h2>
              <button
                onClick={() => setPromoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mã giảm giá (Code)
                </label>
                <Input
                  placeholder="VD: SUMMERSALE20, BRIDE50..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!editingPromo}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Số tiền giảm (VND)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={promoDiscount}
                    onChange={(e) =>
                      setPromoDiscount(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Đơn hàng tối thiểu (VND)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={promoMinOrder}
                    onChange={(e) =>
                      setPromoMinOrder(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Điểm tích lũy để đổi
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={promoPointCharge}
                    onChange={(e) =>
                      setPromoPointCharge(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Hạn sử dụng
                  </label>
                  <Input
                    type="datetime-local"
                    value={promoExpiry}
                    onChange={(e) => setPromoExpiry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setPromoModalOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSavePromo}
                disabled={savingPromo}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 font-semibold cursor-pointer"
              >
                {savingPromo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu Mã"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
