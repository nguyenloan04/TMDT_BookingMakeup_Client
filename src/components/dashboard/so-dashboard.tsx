"use client";

import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Sparkles,
  Calendar,
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Check,
  X,
  CheckCircle,
  FileImage,
  Star,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  Copy,
  FileText,
  ChevronRight,
  Wallet,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  getServiceOwnerProfile,
  updateServiceOwnerProfile,
  getMyServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api";
import { getMyBookings, updateBookingStatus } from "@/lib/api/booking";
import { uploadServiceImage } from "@/services/upload-service";

import { ServiceOwnerProfileDto } from "@/types/user";
import { ServiceDto } from "@/types/service";
import { BookingDto, BookingStatus } from "@/types/booking";

interface SoDashboardProps {
  userId: string;
}

export default function SoDashboard({ userId }: SoDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "services" | "bookings"
  >("services");
  const [loading, setLoading] = useState(false);

  // SO Profile State
  const [soProfile, setSoProfile] = useState<ServiceOwnerProfileDto | null>(
    null,
  );
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [showcaseType, setShowcaseType] = useState<"STANDARD" | "PREMIUM">(
    "STANDARD",
  );
  const [identityFront, setIdentityFront] = useState("");
  const [identityBack, setIdentityBack] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Services State
  const [myServices, setMyServices] = useState<ServiceDto[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDto | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [serviceCat, setServiceCat] = useState("Bride");
  const [serviceDuration, setServiceDuration] = useState(60);
  const [serviceActive, setServiceActive] = useState(true);
  const [savingService, setSavingService] = useState(false);
  const [serviceImageUrl, setServiceImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Bookings State
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  // Booking Filter & Details States
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<BookingDto | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchServices();
    fetchBookings();
  }, []);

  // 1. PROFILE FLOWS
  const fetchProfile = async () => {
    try {
      const prof = await getServiceOwnerProfile();
      setSoProfile(prof);
      setBio(prof.bio || "");
      setExperienceYears(prof.experienceYears || 1);
      setShowcaseType(prof.showcaseType || "STANDARD");
      setIdentityFront(prof.identityFront || "");
      setIdentityBack(prof.identityBack || "");
    } catch {
      // If profile is not found, we let them create one in update
      setSoProfile(null);
    }
  };


  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await updateServiceOwnerProfile({
        bio,
        experienceYears,
        showcaseType,
        identityFront: identityFront || undefined,
        identityBack: identityBack || undefined,
      });
      setSoProfile(updated);
      toast.success("Cập nhật thông tin Service Owner thành công!");
    } catch (e: any) {
      toast.error(e.response?.data || "Lỗi cập nhật thông tin");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. SERVICES FLOWS
  const fetchServices = async () => {
    try {
      const svcs = await getMyServices();
      setMyServices(svcs);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ");
    }
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceName("");
    setServiceDesc("");
    setServicePrice(100000);
    setServiceCat("Bride");
    setServiceDuration(60);
    setServiceActive(true);
    setServiceImageUrl("");
    setImageError("");
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (svc: ServiceDto) => {
    setEditingService(svc);
    setServiceName(svc.name);
    setServiceDesc(svc.description);
    setServicePrice(svc.price);
    setServiceCat(svc.category);
    setServiceDuration(svc.duration);
    setServiceActive(svc.isActive);
    setServiceImageUrl(svc.imageUrl || "");
    setImageError("");
    setServiceModalOpen(true);
  };

  const handleSaveService = async () => {
    if (
      !serviceName.trim() ||
      !serviceCat.trim() ||
      servicePrice <= 0 ||
      serviceDuration <= 0
    ) {
      toast.error("Vui lòng điền đầy đủ và đúng thông tin dịch vụ");
      return;
    }
    setSavingService(true);
    try {
      if (editingService) {
        await updateService(editingService.id, {
          name: serviceName,
          description: serviceDesc,
          price: servicePrice,
          category: serviceCat,
          duration: serviceDuration,
          isActive: serviceActive,
          imageUrl: serviceImageUrl || undefined,
        });
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        await createService({
          name: serviceName,
          description: serviceDesc,
          price: servicePrice,
          category: serviceCat,
          duration: serviceDuration,
          imageUrl: serviceImageUrl || undefined,
        });
        toast.success("Tạo dịch vụ thành công!");
      }
      setServiceModalOpen(false);
      fetchServices();
    } catch (e: any) {
      toast.error(e.response?.data || "Thao tác thất bại");
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
    try {
      await deleteService(id);
      toast.success("Xóa dịch vụ thành công!");
      fetchServices();
    } catch (e: any) {
      toast.error(e.response?.data || "Không thể xóa dịch vụ");
    }
  };

  // 3. BOOKINGS FLOWS
  const fetchBookings = async () => {
    try {
      const list = await getMyBookings();
      setBookings(list);
    } catch {
      toast.error("Không thể tải danh sách đặt lịch");
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
  ) => {
    setUpdatingBookingId(bookingId);
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Cập nhật trạng thái đặt lịch thành: ${status}`);
      fetchBookings();
    } catch (e: any) {
      toast.error(e.response?.data || "Không thể cập nhật trạng thái");
    } finally {
      setUpdatingBookingId(null);
    }
  };


  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.serviceName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      (b.customerDisplayName || "").toLowerCase().includes(bookingSearchQuery.toLowerCase());
    
    const matchesStatus =
      bookingStatusFilter === "ALL" || b.status === bookingStatusFilter;
      
    const matchesDate =
      !bookingDateFilter || b.bookingDate === bookingDateFilter;
      
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === "PENDING").length;
  const completedBookingsCount = bookings.filter((b) => b.status === "COMPLETED").length;
  
  // Revenue: Sum of totalAmount for CONFIRMED or COMPLETED bookings
  const estimatedRevenue = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Deposits collected: Sum of depositAmount for CONFIRMED or COMPLETED bookings
  const collectedDeposits = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "services"
              ? "border-[#E4187D] text-[#E4187D]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Quản Lý Dịch Vụ
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "bookings"
              ? "border-[#E4187D] text-[#E4187D]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Quản Lý Đặt Lịch ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "profile"
              ? "border-[#E4187D] text-[#E4187D]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Hồ Sơ Cửa Hàng
        </button>
      </div>

      {/* TAB 1: MANAGE SERVICES */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900">
                Danh sách các dịch vụ bạn cung cấp
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Khách hàng sẽ nhìn thấy các dịch vụ này trên trang tìm kiếm.
              </p>
            </div>
            <Button
              onClick={handleOpenAddService}
              className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full font-semibold cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Thêm Dịch Vụ
            </Button>
          </div>

          {myServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
              <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">
                Chưa có dịch vụ nào
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Bắt đầu giới thiệu Layout trang điểm của studio để đón khách
                ngay.
              </p>
              <Button
                onClick={handleOpenAddService}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full"
              >
                Tạo dịch vụ đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    {svc.imageUrl && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={svc.imageUrl}
                          alt={svc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">
                        {svc.name}
                      </h4>
                      <Badge
                        className={
                          svc.isActive
                            ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-100 border-gray-200"
                        }
                      >
                        {svc.isActive ? "Đang chạy" : "Ẩn"}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-500 capitalize"
                    >
                      {svc.category}
                    </Badge>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-normal">
                      {svc.description ||
                        "Chưa có mô tả chi tiết cho dịch vụ này."}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                      <span>⏱ {svc.duration} Phút</span>
                      <span>
                        ⭐{" "}
                        {svc.rating
                          ? svc.rating.toFixed(1)
                          : "Chưa có đánh giá"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4 pt-3 border-t border-gray-50 mt-auto">
                    <span className="font-extrabold text-[#E4187D] text-lg">
                      {formatPrice(svc.price)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditService(svc)}
                        className="p-2 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="p-2 hover:bg-red-50 border border-gray-100 rounded-lg text-red-600 hover:border-red-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-5">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Bookings */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-xl bg-pink-50 text-[#E4187D] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Tổng Lịch Hẹn</span>
                <span className="text-2xl font-black text-gray-800">{totalBookingsCount}</span>
              </div>
            </div>

            {/* Card 2: Pending Confirmations */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-xl bg-yellow-50 text-yellow-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Chờ Xác Nhận</span>
                <span className="text-2xl font-black text-gray-800">{pendingBookingsCount}</span>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-xl bg-green-50 text-green-600 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Đã Hoàn Thành</span>
                <span className="text-2xl font-black text-gray-800">{completedBookingsCount}</span>
              </div>
            </div>

            {/* Card 4: Estimated Revenue */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-xl bg-pink-50 text-[#E4187D] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Ước Tính Doanh Thu</span>
                <span className="text-xl font-black text-[#E4187D]">{formatPrice(estimatedRevenue)}</span>
                <span className="text-[10px] text-gray-400 block font-medium">Đã cọc: {formatPrice(collectedDeposits)}</span>
              </div>
            </div>
          </div>

          {/* Filters & Search Controls */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm tên khách hàng hoặc tên dịch vụ..."
                  className="pl-10 rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-100"
                  value={bookingSearchQuery}
                  onChange={(e) => setBookingSearchQuery(e.target.value)}
                />
              </div>
              {/* Date Filter */}
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Input
                    type="date"
                    className="rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-100 text-xs w-[160px] pl-3 pr-2 py-1.5"
                    value={bookingDateFilter}
                    onChange={(e) => setBookingDateFilter(e.target.value)}
                  />
                </div>
                {bookingDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-red-500 rounded-full shrink-0"
                    onClick={() => setBookingDateFilter("")}
                  >
                    Xóa ngày
                  </Button>
                )}
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
              {[
                { value: "ALL", label: "Tất cả" },
                { value: "PENDING", label: "Chờ xác nhận" },
                { value: "CONFIRMED", label: "Đã xác nhận" },
                { value: "COMPLETED", label: "Đã hoàn thành" },
                { value: "CANCELLED", label: "Đã hủy" },
              ].map((pill) => {
                const isActive = bookingStatusFilter === pill.value;
                const count = pill.value === "ALL" 
                  ? bookings.length 
                  : bookings.filter((b) => b.status === pill.value).length;
                return (
                  <Button
                    key={pill.value}
                    variant={isActive ? "default" : "outline"}
                    className={`rounded-full text-xs px-4 py-1.5 shrink-0 transition-all font-semibold cursor-pointer ${
                      isActive 
                        ? "bg-[#E4187D] hover:bg-[#c9126b] text-white shadow-sm" 
                        : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                    onClick={() => setBookingStatusFilter(pill.value as "ALL" | BookingStatus)}
                  >
                    {pill.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto space-y-4">
              <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
                <AlertCircle className="w-10 h-10 text-gray-350" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-lg">
                  Không tìm thấy lịch hẹn
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  {bookings.length === 0 
                    ? "Các yêu cầu đặt lịch từ khách hàng cho dịch vụ của bạn sẽ hiển thị tại đây."
                    : "Không có lịch hẹn nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại."}
                </p>
              </div>
              {bookings.length > 0 && (
                <Button
                  onClick={() => {
                    setBookingSearchQuery("");
                    setBookingStatusFilter("ALL");
                    setBookingDateFilter("");
                  }}
                  variant="outline"
                  className="rounded-full text-xs font-semibold px-5 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative overflow-hidden group"
                >
                  {/* Left line decorator based on status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-500"
                      : booking.status === "COMPLETED"
                        ? "bg-blue-500"
                        : booking.status === "CANCELLED"
                          ? "bg-gray-300"
                          : "bg-yellow-500"
                  }`} />
                  
                  <div className="space-y-2.5 pl-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-[#E4187D] transition-colors">
                        {booking.serviceName}
                      </span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-md">
                        Khách: {booking.customerDisplayName || "Chưa cập nhật"}
                      </span>
                      <Badge
                        className={
                          booking.status === "CONFIRMED"
                            ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200 border"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 border"
                              : booking.status === "CANCELLED"
                                ? "bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200 border"
                                : "bg-yellow-50 text-yellow-750 hover:bg-yellow-50 border-yellow-250 border"
                        }
                      >
                        {booking.status === "PENDING"
                          ? "Chờ Xác Nhận"
                          : booking.status === "CONFIRMED"
                            ? "Đã Xác Nhận"
                            : booking.status === "COMPLETED"
                              ? "Đã Hoàn Thành"
                              : "Đã Hủy"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-gray-500 font-medium font-mono">
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Giờ: {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Ngày: {booking.bookingDate.split("-").reverse().join("/")}</span>
                      </p>
                      {booking.artistName && (
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>Thợ: {booking.artistName}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs pt-1.5 border-t border-gray-50/50">
                      <p className="text-gray-400 font-mono">
                        Tổng cộng:{" "}
                        <span className="font-extrabold text-gray-700">
                          {formatPrice(booking.totalAmount)}
                        </span>
                      </p>
                      <p className="text-gray-400 font-mono">
                        Khách cọc (55%):{" "}
                        <span className="font-extrabold text-pink-600">
                          {formatPrice(booking.depositAmount)}
                        </span>
                      </p>
                      <p className="text-gray-400 font-mono">
                        Còn lại (45%):{" "}
                        <span className="font-bold text-gray-500">
                          {formatPrice(booking.totalAmount - booking.depositAmount)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Detail trigger */}
                  <div className="flex gap-2 w-full lg:w-auto justify-between lg:justify-end items-center self-stretch lg:self-center shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 mt-2 lg:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDetailBooking(booking)}
                      className="text-xs font-semibold text-gray-500 hover:text-[#E4187D] hover:bg-pink-50 rounded-full flex items-center gap-1 px-4 cursor-pointer"
                    >
                      Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                    
                    <div className="flex gap-1.5">
                      {updatingBookingId === booking.id ? (
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold py-1.5 px-3">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E4187D]" />
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
                                className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold px-4 py-1.5 cursor-pointer flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Chấp Nhận
                              </Button>
                              <Button
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED",
                                  )
                                }
                                variant="outline"
                                className="border-red-200 text-red-650 hover:bg-red-50 hover:text-red-750 rounded-full text-xs font-bold px-4 py-1.5 cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Từ Chối
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
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold px-4 py-1.5 cursor-pointer flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Hoàn Thành
                              </Button>
                              <Button
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED",
                                  )
                                }
                                variant="outline"
                                className="border-red-200 text-red-650 hover:bg-red-50 hover:text-red-750 rounded-full text-xs font-bold px-4 py-1.5 cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Hủy Lịch
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* TAB 4: MY PROFILE (SO PROFILE) */}
      {activeTab === "profile" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Thông Tin Cửa Hàng / Studio
            </h3>
            <p className="text-gray-500 text-xs">
              Cập nhật tiểu sử, kinh nghiệm và giấy tờ xác minh để khách hàng
              tin tưởng.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tiểu sử (Bio)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100 min-h-[100px]"
                placeholder="Giới thiệu phong cách trang điểm, thế mạnh của studio của bạn..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Số năm kinh nghiệm
                </label>
                <Input
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) =>
                    setExperienceYears(parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Gói hiển thị (Showcase Type)
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100"
                  value={showcaseType}
                  onChange={(e) =>
                    setShowcaseType(e.target.value as "STANDARD" | "PREMIUM")
                  }
                >
                  <option value="STANDARD">STANDARD (Gói Cơ Bản)</option>
                  <option value="PREMIUM">PREMIUM (Nổi Bật - Ưu Tiên)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-gray-400" /> Mặt trước
                  CMND/CCCD (URL)
                </label>
                <Input
                  placeholder="Link hình ảnh mặt trước..."
                  value={identityFront}
                  onChange={(e) => setIdentityFront(e.target.value)}
                />
                {identityFront && (
                  <div className="relative h-32 border rounded-xl overflow-hidden mt-1.5 bg-gray-50 flex items-center justify-center">
                    <img
                      src={identityFront}
                      alt="CCCD Front"
                      className="h-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-gray-400" /> Mặt sau
                  CMND/CCCD (URL)
                </label>
                <Input
                  placeholder="Link hình ảnh mặt sau..."
                  value={identityBack}
                  onChange={(e) => setIdentityBack(e.target.value)}
                />
                {identityBack && (
                  <div className="relative h-32 border rounded-xl overflow-hidden mt-1.5 bg-gray-50 flex items-center justify-center">
                    <img
                      src={identityBack}
                      alt="CCCD Back"
                      className="h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="text-xs text-gray-400">
                Trạng thái duyệt:{" "}
                <span className="font-semibold text-gray-700 uppercase">
                  {soProfile?.verificationStatus || "pending"}
                </span>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 font-semibold cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu Thay Đổi"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* SERVICE MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
              </h2>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </label>
                <Input
                  placeholder="VD: Trang điểm Cô Dâu VIP, Đi Tiệc..."
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Danh mục
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100"
                  value={serviceCat}
                  onChange={(e) => setServiceCat(e.target.value)}
                >
                  <option value="Bride">Cô dâu (Bride)</option>
                  <option value="Party">Đi tiệc (Party)</option>
                  <option value="Daily">Hằng ngày (Daily)</option>
                  <option value="Celebrity">
                    Sự kiện/Sân khấu (Celebrity)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Giá tiền (VND)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={servicePrice}
                    onChange={(e) =>
                      setServicePrice(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Thời lượng thực hiện (Phút)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={serviceDuration}
                    onChange={(e) =>
                      setServiceDuration(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Service Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Hình ảnh dịch vụ (Upload lên Cloud)
                </label>
                {imageError && (
                  <div className="text-xs text-red-500 font-medium mb-1">
                    {imageError}
                  </div>
                )}
                {serviceImageUrl ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={serviceImageUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setServiceImageUrl("")}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80 cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition relative overflow-hidden ${isUploadingImage ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                    <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center">
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-1.5" />
                          <p className="text-xs text-gray-500 font-medium">Đang tải ảnh lên...</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500 font-medium"><span className="text-[#E4187D] font-bold">Bấm để tải ảnh lên</span></p>
                          <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP tối đa 5MB</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/jpg, image/webp" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingImage(true);
                          setImageError("");
                          const url = await uploadServiceImage(file);
                          setServiceImageUrl(url);
                        } catch (err: unknown) {
                          setImageError(err instanceof Error ? err.message : "Không thể upload ảnh, vui lòng thử lại.");
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      disabled={isUploadingImage || savingService}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mô tả dịch vụ
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100 min-h-[80px]"
                  placeholder="Ghi chú chi tiết về layout, loại mỹ phẩm, quà tặng đi kèm..."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                />
              </div>

              {editingService && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="serviceActive"
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                    checked={serviceActive}
                    onChange={(e) => setServiceActive(e.target.checked)}
                  />
                  <label
                    htmlFor="serviceActive"
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                  >
                    Cho phép hiển thị/Hoạt động
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setServiceModalOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSaveService}
                disabled={savingService}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 font-semibold cursor-pointer"
              >
                {savingService ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu Lại"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* BOOKING DETAIL MODAL */}
      {selectedDetailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-bold text-gray-900">Chi Tiết Lịch Hẹn</h2>
              </div>
              <button
                onClick={() => setSelectedDetailBooking(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5">
              {/* Customer and Service summary */}
              <div className="bg-pink-50/30 p-4 rounded-2xl border border-pink-100/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
                      {selectedDetailBooking.serviceName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">ID Đơn: {selectedDetailBooking.id}</p>
                  </div>
                  <Badge
                    className={
                      selectedDetailBooking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold"
                        : selectedDetailBooking.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold"
                          : selectedDetailBooking.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none font-bold"
                    }
                  >
                    {selectedDetailBooking.status === "PENDING"
                      ? "Chờ Xác Nhận"
                      : selectedDetailBooking.status === "CONFIRMED"
                        ? "Đã Xác Nhận"
                        : selectedDetailBooking.status === "COMPLETED"
                          ? "Đã Hoàn Thành"
                          : "Đã Hủy"}
                  </Badge>
                </div>
                
                <div className="border-t border-dashed border-pink-100/50 pt-2 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-650 text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-500">Khách hàng:</span>{" "}
                    <span className="font-bold text-gray-800">
                      {selectedDetailBooking.customerDisplayName || "Chưa cập nhật"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-500">Nghệ sĩ phụ trách:</span>{" "}
                    <span className="font-bold text-gray-800">
                      {selectedDetailBooking.artistName || "Chưa cập nhật"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Date & Time details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ngày Hẹn</span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <Calendar className="w-4 h-4 text-[#E4187D] shrink-0" />
                    <span>{selectedDetailBooking.bookingDate.split("-").reverse().join("/")}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Thời Gian</span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <Clock className="w-4 h-4 text-[#E4187D] shrink-0" />
                    <span>
                      {selectedDetailBooking.startTime.slice(0, 5)} - {selectedDetailBooking.endTime.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Calculation summary */}
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chi Tiết Thanh Toán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Giá dịch vụ gốc:</span>
                    <span className="font-medium">{formatPrice(selectedDetailBooking.servicePrice || selectedDetailBooking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-800 font-bold border-t border-dashed border-gray-200 pt-2 text-base">
                    <span>Tổng số tiền:</span>
                    <span className="text-[#E4187D]">{formatPrice(selectedDetailBooking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-green-700 bg-green-50 p-2.5 rounded-xl text-xs font-medium items-center border border-green-100/50">
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-green-600" />
                      Khách đã đặt cọc (55%):
                    </span>
                    <span className="font-bold">{formatPrice(selectedDetailBooking.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-pink-700 bg-pink-50/60 p-2.5 rounded-xl text-xs font-medium items-center border border-pink-100/30">
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-[#E4187D]" />
                      Còn lại cần thu tại tiệm (45%):
                    </span>
                    <span className="font-bold">{formatPrice(selectedDetailBooking.totalAmount - selectedDetailBooking.depositAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  className="rounded-full px-5 text-gray-500 cursor-pointer"
                  onClick={() => setSelectedDetailBooking(null)}
                >
                  Đóng
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Sao chép ID đơn đặt"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDetailBooking.id);
                    toast.success("Đã sao chép ID đơn đặt lịch!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 shrink-0">
                {updatingBookingId === selectedDetailBooking.id ? (
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#E4187D]" />
                    Đang lưu...
                  </div>
                ) : (
                  <>
                    {selectedDetailBooking.status === "PENDING" && (
                      <>
                        <Button
                          onClick={async () => {
                            await handleUpdateBookingStatus(selectedDetailBooking.id, "CONFIRMED");
                            setSelectedDetailBooking(prev => prev ? { ...prev, status: "CONFIRMED" } : null);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-xs px-4 cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Chấp Nhận
                        </Button>
                        <Button
                          onClick={async () => {
                            await handleUpdateBookingStatus(selectedDetailBooking.id, "CANCELLED");
                            setSelectedDetailBooking(prev => prev ? { ...prev, status: "CANCELLED" } : null);
                          }}
                          variant="outline"
                          className="border-red-200 text-red-650 hover:bg-red-50 hover:text-red-750 rounded-full font-bold text-xs px-4 cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Từ Chối
                        </Button>
                      </>
                    )}
                    {selectedDetailBooking.status === "CONFIRMED" && (
                      <>
                        <Button
                          onClick={async () => {
                            await handleUpdateBookingStatus(selectedDetailBooking.id, "COMPLETED");
                            setSelectedDetailBooking(prev => prev ? { ...prev, status: "COMPLETED" } : null);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs px-4 cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Hoàn Thành
                        </Button>
                        <Button
                          onClick={async () => {
                            await handleUpdateBookingStatus(selectedDetailBooking.id, "CANCELLED");
                            setSelectedDetailBooking(prev => prev ? { ...prev, status: "CANCELLED" } : null);
                          }}
                          variant="outline"
                          className="border-red-200 text-red-655 hover:bg-red-50 hover:text-red-700 rounded-full font-bold text-xs px-4 cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Hủy Lịch
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
