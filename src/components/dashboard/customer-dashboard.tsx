"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  User,
  Mail,
  Phone,
  Save,
  UploadCloud,
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { 
  getAllServices, 
  getFavourites, 
  addFavourite, 
  removeFavourite, 
  getProfile,
  updateProfile,
} from "@/lib/api";
import { createBooking, getMyBookings } from "@/lib/api/booking";
import { validatePromotion } from "@/lib/api/promotions";
import { createReview, getReviewsByService } from "@/lib/api/reviews";
import { uploadAvatarImage } from "@/services/upload-service";

import { ServiceDto } from "@/types/service";
import { BookingDto } from "@/types/booking";
import { CommentTag, ReviewDto } from "@/types/review";
import { UserDto } from "@/types/user";
import { defaultAvatar } from "@/common/constant/default-avatar";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"explorer" | "favourites" | "bookings" | "profile">("explorer");
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [favourites, setFavourites] = useState<ServiceDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [profile, setProfile] = useState<UserDto | null>(null);
  
  const [favStatusMap, setFavStatusMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Profile State
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileGender, setProfileGender] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    errorMessage: string | null;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [serviceReviews, setServiceReviews] = useState<ReviewDto[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
  const [bookingRating, setBookingRating] = useState(5);
  const [artistRating, setArtistRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewTag, setReviewTag] = useState<CommentTag>("NICE_ATTITUDE");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const currentProfile = await getProfile();
      setProfile(currentProfile);
      setProfileDisplayName(currentProfile.displayName || "");
      setProfileAvatarUrl(currentProfile.avatarUrl || "");
      setProfilePhone(currentProfile.phone || "");
      setProfileGender(currentProfile.gender?.toString() || "");
      setProfileAddress(currentProfile.address || "");

      const allSvcs = await getAllServices();
      setServices(allSvcs);

      // Check fav status
      const favList = await getFavourites();
      setFavourites(favList);
      
      const favMap: Record<string, boolean> = {};
      favList.forEach(item => {
        favMap[item.id] = true;
      });
      setFavStatusMap(favMap);

      const bookingList = await getMyBookings();
      setBookings(bookingList);
    } catch {
      toast.error("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (error as { response?: { data?: unknown } }).response;
      if (typeof response?.data === "string") {
        return response.data;
      }
      if (typeof response?.data === "object" && response.data !== null) {
        const data = response.data as { message?: unknown; error?: unknown };
        if (typeof data.message === "string") return data.message;
        if (typeof data.error === "string") return data.error;
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallback;
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        displayName: profileDisplayName.trim() || undefined,
        avatarUrl: profileAvatarUrl.trim() || undefined,
        phone: profilePhone.trim() || undefined,
        gender: profileGender || undefined,
        address: profileAddress.trim() || undefined,
      });
      setProfile(updated);
      setProfileDisplayName(updated.displayName || "");
      setProfileAvatarUrl(updated.avatarUrl || "");
      setProfilePhone(updated.phone || "");
      setProfileGender(updated.gender?.toString() || "");
      setProfileAddress(updated.address || "");
      toast.success("Cập nhật hồ sơ cá nhân thành công!");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Không thể cập nhật hồ sơ cá nhân"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const url = await uploadAvatarImage(file);
      setProfileAvatarUrl(url);
      toast.success("Tải ảnh đại diện thành công!");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Không thể tải ảnh đại diện";
      setAvatarError(message);
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleToggleFav = async (serviceId: string) => {
    const isFav = !!favStatusMap[serviceId];
    try {
      if (isFav) {
        await removeFavourite(serviceId);
        toast.success("Đã xóa khỏi danh sách yêu thích");
        setFavStatusMap(prev => ({ ...prev, [serviceId]: false }));
      } else {
        await addFavourite(serviceId);
        toast.success("Đã thêm vào danh sách yêu thích");
        setFavStatusMap(prev => ({ ...prev, [serviceId]: true }));
      }
      // Reload favourites list
      const favList = await getFavourites();
      setFavourites(favList);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleOpenBooking = async (svc: ServiceDto) => {
    setSelectedService(svc);
    setBookingDate("");
    setBookingTime("");
    setCouponCode("");
    setValidationResult(null);
    setServiceReviews([]);
    setBookingModalOpen(true);
    setLoadingReviews(true);
    try {
      const list = await getReviewsByService(svc.id);
      setServiceReviews(list);
    } catch {
      // ignore
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !selectedService) return;
    setValidatingCoupon(true);
    try {
      const res = await validatePromotion({
        code: couponCode.trim().toUpperCase(),
        bookingAmount: selectedService.price,
        ownerId: selectedService.ownerId
      });
      setValidationResult(res);
      if (res.valid) {
        toast.success("Áp dụng mã giảm giá thành công!");
      } else {
        toast.error(res.errorMessage || "Mã không hợp lệ");
      }
    } catch {
      toast.error("Lỗi xác thực mã giảm giá");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedService || !bookingDate || !bookingTime) {
      toast.error("Vui lòng nhập đầy đủ ngày và giờ bắt đầu");
      return;
    }
    setSubmittingBooking(true);
    try {
      await createBooking({
        serviceId: selectedService.id,
        ownerId: selectedService.ownerId,
        bookingDate,
        startTime: bookingTime.includes(":") ? (bookingTime.split(":").length === 2 ? `${bookingTime}:00` : bookingTime) : `${bookingTime}:00:00`,
        promoCode: couponCode.trim() || undefined
      });
      toast.success("Đặt lịch thành công! Chờ Service Owner xác nhận.");
      setBookingModalOpen(false);
      // Reload bookings
      const bookingList = await getMyBookings();
      setBookings(bookingList);
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Đặt lịch thất bại"));
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleOpenReview = (booking: BookingDto) => {
    setSelectedBooking(booking);
    setBookingRating(5);
    setArtistRating(5);
    setComment("");
    setReviewTag("NICE_ATTITUDE");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    setSubmittingReview(true);
    try {
      await createReview({
        bookingId: selectedBooking.id,
        bookingRating,
        artistRating,
        comment,
        tags: reviewTag
      });
      toast.success("Gửi đánh giá thành công! Cảm ơn đóng góp của bạn.");
      setReviewModalOpen(false);
      // Reload bookings to update reviewed status
      const bookingList = await getMyBookings();
      setBookings(bookingList);
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Không thể gửi đánh giá"));
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  };

  const filteredServices = services.filter(svc => {
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || svc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("explorer")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "explorer" 
              ? "border-[#E4187D] text-[#E4187D]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Khám Phá Dịch Vụ
        </button>
        <button
          onClick={() => setActiveTab("favourites")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "favourites" 
              ? "border-[#E4187D] text-[#E4187D]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Danh Sách Yêu Thích ({favourites.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "bookings" 
              ? "border-[#E4187D] text-[#E4187D]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Lịch Hẹn Của Tôi ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 px-1 font-semibold transition-all border-b-2 text-sm cursor-pointer ${
            activeTab === "profile" 
              ? "border-[#E4187D] text-[#E4187D]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Hồ Sơ cá nhân
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
          <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SERVICES EXPLORER */}
          {activeTab === "explorer" && (
            <div className="space-y-6">
              {/* Search & Category Filter */}
              <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm tên dịch vụ, phong cách..."
                    className="pl-10 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className={`rounded-full ${selectedCategory === "all" ? "bg-[#E4187D] hover:bg-[#c9126b] text-white" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    Tất cả
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={`rounded-full capitalize ${selectedCategory === cat ? "bg-[#E4187D] hover:bg-[#c9126b] text-white" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-8">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không tìm thấy dịch vụ nào phù hợp.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(svc => (
                    <Card key={svc.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between border-gray-100">
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={svc.imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600"}
                          alt={svc.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          onClick={() => handleToggleFav(svc.id)}
                          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer text-pink-600 shadow-sm"
                        >
                          <Heart className={`w-5 h-5 ${favStatusMap[svc.id] ? "fill-pink-600 text-pink-600" : "text-gray-400"}`} />
                        </button>
                        <Badge className="absolute bottom-3 left-3 bg-[#E4187D] text-white hover:bg-[#E4187D]">
                          {svc.category}
                        </Badge>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold line-clamp-1">{svc.name}</CardTitle>
                          <div className="flex items-center text-yellow-500 font-bold text-sm shrink-0">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {svc.rating ? svc.rating.toFixed(1) : "5.0"}
                          </div>
                        </div>
                        <CardDescription className="text-sm line-clamp-2 mt-1">{svc.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex justify-between text-xs text-gray-500 mt-2 border-t border-gray-50 pt-2">
                          <span>⏱ {svc.duration} Phút</span>
                          <span>Chuyên viên giàu kinh nghiệm</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-3">
                        <span className="text-lg font-extrabold text-[#E4187D]">{formatPrice(svc.price)}</span>
                        <Link href={`/services/${svc.id}`}>
                          <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-6 font-semibold cursor-pointer text-xs">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY FAVOURITES */}
          {activeTab === "favourites" && (
            <div className="space-y-6">
              {favourites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Chưa có dịch vụ yêu thích</h3>
                  <p className="text-gray-500 text-sm mb-6">Thêm các Layout trang điểm bạn yêu thích vào đây để theo dõi tiện lợi.</p>
                  <Button onClick={() => setActiveTab("explorer")} className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full">
                    Khám phá dịch vụ ngay
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favourites.map(svc => (
                    <Card key={svc.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between border-gray-100">
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={svc.imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600"}
                          alt={svc.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          onClick={() => handleToggleFav(svc.id)}
                          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer text-pink-600 shadow-sm"
                        >
                          <Heart className="w-5 h-5 fill-pink-600 text-pink-600" />
                        </button>
                        <Badge className="absolute bottom-3 left-3 bg-[#E4187D] text-white hover:bg-[#E4187D]">
                          {svc.category}
                        </Badge>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold line-clamp-1">{svc.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm line-clamp-2 mt-1">{svc.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-4 flex justify-between items-center gap-3 border-t border-gray-50 mt-4">
                        <span className="text-lg font-extrabold text-[#E4187D]">{formatPrice(svc.price)}</span>
                        <Link href={`/services/${svc.id}`}>
                          <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-6 font-semibold cursor-pointer text-xs">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Chưa có lịch hẹn nào</h3>
                  <p className="text-gray-500 text-sm mb-6">Bạn chưa đặt bất kỳ lịch hẹn trang điểm nào gần đây.</p>
                  <Button onClick={() => setActiveTab("explorer")} className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full">
                    Tìm dịch vụ đặt ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-lg">{booking.serviceName}</span>
                          <Badge 
                            variant={
                              booking.status === "CONFIRMED" ? "default" : 
                              booking.status === "COMPLETED" ? "secondary" : 
                              booking.status === "CANCELLED" ? "destructive" : "outline"
                            }
                            className={
                              booking.status === "CONFIRMED" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                              booking.status === "COMPLETED" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                              booking.status === "CANCELLED" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                              "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {booking.status === "PENDING" ? "Chờ Xác Nhận" :
                             booking.status === "CONFIRMED" ? "Đã Xác Nhận" :
                             booking.status === "COMPLETED" ? "Đã Hoàn Thành" : "Đã Hủy"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-500">
                          <p className="flex items-center gap-1.5"><Clock className="w-4 h-4 shrink-0 text-gray-400" /> Giờ: {booking.startTime.slice(0,5)} - {booking.endTime.slice(0,5)}</p>
                          <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4 shrink-0 text-gray-400" /> Ngày: {booking.bookingDate.split("-").reverse().join("/")}</p>
                          <p className="flex items-center gap-1.5"><Star className="w-4 h-4 shrink-0 text-gray-400" /> Chuyên viên: {booking.artistName}</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                          <p>Tổng tiền: <span className="font-semibold text-gray-700">{formatPrice(booking.totalAmount)}</span></p>
                          <p>Tiền cọc (55%): <span className="font-semibold text-pink-600">{formatPrice(booking.depositAmount)}</span></p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto self-end md:self-center shrink-0">
                        {booking.status === "COMPLETED" && (
                          <Button
                            onClick={() => handleOpenReview(booking)}
                            className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full font-semibold text-xs py-2 w-full md:w-auto cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            Đánh Giá Ngay
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PERSONAL PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-72 shrink-0 space-y-4">
                    <div className="flex flex-col items-center text-center bg-gray-50/70 border border-gray-100 rounded-2xl p-5">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white">
                        <Image
                          src={profileAvatarUrl || profile?.avatarUrl || defaultAvatar}
                          alt={profile?.displayName || profile?.username || "Customer"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <h3 className="mt-3 font-extrabold text-gray-900 text-lg">
                        {profileDisplayName || profile?.username || "Khách hàng"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {profile?.email || "Chưa có email"}
                      </p>
                      <div className="mt-4 w-full grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="block text-gray-400 font-semibold uppercase">
                            Điểm
                          </span>
                          <span className="block text-[#E4187D] font-extrabold text-base">
                            {profile?.totalPoints ?? 0}
                          </span>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="block text-gray-400 font-semibold uppercase">
                            Lịch hẹn
                          </span>
                          <span className="block text-gray-900 font-extrabold text-base">
                            {bookings.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50/50 border border-pink-100/60 rounded-2xl p-4 text-sm text-gray-600 space-y-2">
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#E4187D]" />
                        Thông tin tài khoản
                      </p>
                      <p className="flex items-center gap-2 text-xs">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {profile?.email || "Chưa cập nhật email"}
                      </p>
                      <p className="flex items-center gap-2 text-xs">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {profilePhone || "Chưa cập nhật số điện thoại"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Hồ Sơ cá nhân
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Cập nhật thông tin liên hệ để studio phục vụ và xác nhận
                        lịch hẹn thuận tiện hơn.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Tên hiển thị
                        </label>
                        <Input
                          placeholder="Tên bạn muốn hiển thị"
                          value={profileDisplayName}
                          onChange={(e) => setProfileDisplayName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Tên đăng nhập
                        </label>
                        <Input value={profile?.username || ""} disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <Input value={profile?.email || ""} disabled />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Số điện thoại
                        </label>
                        <Input
                          placeholder="Nhập số điện thoại"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Giới tính
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100"
                          value={profileGender}
                          onChange={(e) => setProfileGender(e.target.value)}
                        >
                          <option value="">Chưa cập nhật</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="MALE">Nam</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                          Ảnh đại diện
                        </label>
                        {avatarError && (
                          <p className="text-xs text-red-500 font-medium">
                            {avatarError}
                          </p>
                        )}
                        <label
                          className={`flex items-center justify-between gap-3 w-full border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition ${
                            uploadingAvatar
                              ? "border-gray-200 bg-gray-50"
                              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {uploadingAvatar ? (
                              <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />
                            ) : (
                              <UploadCloud className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                            <div className="min-w-0 text-left">
                              <p className="text-xs font-bold text-[#E4187D] truncate">
                                {uploadingAvatar ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                PNG, JPG, WEBP tối đa 5MB
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-gray-400 shrink-0">
                            Browse
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            disabled={uploadingAvatar || savingProfile}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (file) {
                                handleUploadAvatar(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Địa chỉ
                      </label>
                      <textarea
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100 min-h-[90px]"
                        placeholder="Nhập địa chỉ để studio dễ liên hệ khi cần..."
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
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
                          <>
                            <Save className="w-4 h-4 mr-1.5" />
                            Lưu Hồ Sơ
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">Đặt Lịch Trang Điểm</h2>
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-pink-50/50 p-4 rounded-2xl flex gap-3 border border-pink-100/30">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200"
                    alt={selectedService.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedService.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">⏱ Thời gian: {selectedService.duration} Phút</p>
                  <p className="text-sm font-bold text-[#E4187D] mt-1">{formatPrice(selectedService.price)}</p>
                </div>
              </div>

              {/* Date & Time Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chọn ngày đặt</label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chọn giờ bắt đầu</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg p-2 bg-white text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="">-- Chọn Khung Giờ --</option>
                    {["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"].map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-1 pt-2 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập coupon code (nếu có)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button 
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="bg-[#E4187D]/10 hover:bg-[#E4187D]/20 text-[#E4187D] rounded-lg font-semibold border-none cursor-pointer"
                  >
                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Áp dụng"}
                  </Button>
                </div>
                {validationResult && (
                  <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-1.5 ${validationResult.valid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {validationResult.valid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        <span>Đã giảm {formatPrice(validationResult.discountAmount)}. Tổng mới: {formatPrice(validationResult.finalAmount)}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{validationResult.errorMessage || "Mã giảm giá không hợp lệ"}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Calculation summary */}
              <div className="border-t border-gray-100 pt-4 text-sm space-y-2 bg-gray-50/50 p-4 rounded-2xl">
                <div className="flex justify-between text-gray-600">
                  <span>Giá dịch vụ</span>
                  <span>{formatPrice(selectedService.price)}</span>
                </div>
                {validationResult?.valid && (
                  <div className="flex justify-between text-green-700">
                    <span>Giảm giá (Coupon)</span>
                    <span>-{formatPrice(validationResult.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 border-t border-dashed border-gray-200 pt-2 text-base">
                  <span>Tổng thanh toán</span>
                  <span>{formatPrice(validationResult?.valid ? validationResult.finalAmount : selectedService.price)}</span>
                </div>
                <div className="flex justify-between font-semibold text-pink-600 bg-pink-50 p-2 rounded-lg text-xs mt-2">
                  <span>Đặt cọc ngay (55%)</span>
                  <span>{formatPrice((validationResult?.valid ? validationResult.finalAmount : selectedService.price) * 0.55)}</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Số tiền cọc 55% sẽ được thanh toán sau khi Service Owner xác nhận lịch hẹn. 45% còn lại thanh toán tại Studio.
                </p>
              </div>

              {/* Customer Reviews Section */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Nhận xét từ khách hàng ({serviceReviews.length})
                </h4>
                
                {loadingReviews ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#E4187D]" />
                  </div>
                ) : serviceReviews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Chưa có nhận xét nào cho dịch vụ này.</p>
                ) : (
                  <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                    {serviceReviews.map(rev => (
                      <div key={rev.id} className="bg-gray-50/50 border border-gray-100/50 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{rev.customer}</span>
                          <div className="flex items-center text-yellow-500 font-bold">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed">&quot;{rev.comment}&quot;</p>
                        <p className="text-[10px] text-gray-400 text-right">{rev.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <Button variant="outline" className="rounded-full px-6" onClick={() => setBookingModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleCreateBooking}
                disabled={submittingBooking || !bookingDate || !bookingTime}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 font-semibold cursor-pointer"
              >
                {submittingBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác Nhận Đặt"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">Đánh Giá Dịch Vụ</h2>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">Đánh giá của bạn giúp cải thiện chất lượng phục vụ cho những khách hàng tiếp theo.</p>
              
              {/* Ratings */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/30">
                  <span className="text-sm font-semibold text-gray-700">Độ hài lòng về layout trang điểm</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setBookingRating(star)}
                        className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= bookingRating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/30">
                  <span className="text-sm font-semibold text-gray-700">Thái độ của chuyên viên (Artist)</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setArtistRating(star)}
                        className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= artistRating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đặc điểm nổi bật</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "NICE_ATTITUDE", label: "Thái độ nhiệt tình" },
                    { key: "GOOD_SERVICE", label: "Dịch vụ xuất sắc" },
                    { key: "ON_TIME", label: "Đúng hẹn chuẩn giờ" },
                    { key: "BAD_SERVICE", label: "Dịch vụ chưa tốt" },
                    { key: "WORST_ATTITUDE", label: "Thái độ không thân thiện" }
                  ].map(tag => (
                    <button
                      key={tag.key}
                      onClick={() => setReviewTag(tag.key as CommentTag)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                        reviewTag === tag.key 
                          ? "bg-[#E4187D]/10 border-[#E4187D] text-[#E4187D] font-bold" 
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nhận xét chi tiết</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-100 min-h-[90px]"
                  placeholder="Chia sẻ trải nghiệm làm đẹp của bạn với mọi người..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <Button variant="outline" className="rounded-full px-6" onClick={() => setReviewModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleSubmitReview}
                disabled={submittingReview || !comment.trim()}
                className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 font-semibold cursor-pointer"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi Đánh Giá"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
