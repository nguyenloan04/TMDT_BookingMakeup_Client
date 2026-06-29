"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  AlertCircle,
  CheckCircle2, // Đã thêm icon Check cho thông báo thành công
} from "lucide-react";
import { MakeupService } from "@/types/service";
import { createBooking, getBookingsByArtist } from "@/lib/api/booking";
import Image from "next/image";
import { getServiceDetail } from "@/services/artist-service";
import { ServiceDetailResponse } from "@/types/artist";
import { useAuth } from "@/contexts/auth-context";

// Helpers
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

// Tạo danh sách khung giờ theo bước 30 phút từ 7:00 → 20:30
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 20; h++) {
    slots.push(`${pad(h)}:00:00`);
    slots.push(`${pad(h)}:30:00`);
  }
  return slots.filter((_, i) => i < 28);
}

const TIME_SLOTS = generateTimeSlots();

// Tháng VN
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// Calendar mini
function MiniCalendar({
  selected,
  onSelect,
  bookedDates,
}: {
  selected: string | null;
  onSelect: (d: string) => void;
  bookedDates: Set<string>;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay === 0 ? 6 : firstDay - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={16} /></button>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = isoDate(viewYear, viewMonth, day);
          const isToday = dateStr === isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
          const isPast = new Date(viewYear, viewMonth - 1, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = dateStr === selected;
          const isBooked = bookedDates.has(dateStr);

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => !isPast && onSelect(dateStr)}
              style={{
                width: "100%", aspectRatio: "1", borderRadius: 8,
                border: isSelected ? "2px solid #ec4899" : isToday ? "2px solid #f9a8d4" : "none",
                background: isSelected ? "#ec4899" : isBooked ? "#fef2f2" : "transparent",
                color: isSelected ? "#fff" : isPast ? "#d1d5db" : isBooked ? "#f87171" : "#111827",
                fontSize: 13, fontWeight: isSelected || isToday ? 700 : 400,
                cursor: isPast ? "not-allowed" : "pointer",
                position: "relative",
              }}
            >
              {day}
              {isBooked && !isSelected && (
                <span style={{
                  position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: "#f87171",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid #e5e7eb", borderRadius: 8,
  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "#6b7280",
};

// Main Page
export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = params.serviceId as string;
  const artistId = searchParams.get("artistId") ?? "";
  const { user } = useAuth()

  const [service, setService] = useState<MakeupService | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    getServiceDetail(serviceId).then((res: ServiceDetailResponse | null) => {
      if (res) {
        setService({
          serviceUuid: res.serviceId,
          artistUuid: res.ownerId,
          title: res.name,
          category: res.category || "",
          categoryTag: res.category || "",
          categoryTagColor: "pink",
          artistName: res.ownerName || "",
          artistInitials: res.ownerName ? res.ownerName.charAt(0).toUpperCase() : "A",
          artistColor: "#ec4899",
          rating: res.rating || 0,
          reviewCount: res.reviewCount || 0,
          priceFrom: res.price,
          duration: res.duration,
          imageUrl: res.mainThumbnailUrl || "",
          location: res.address || "",
          description: res.description || ""
        });
      }
    }).catch(err => console.error("Không lấy được thông tin dịch vụ", err));
  }, [serviceId]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(!!artistId);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // State thông báo thành công

  useEffect(() => {
    if (!artistId) return;
    getBookingsByArtist(artistId)
      .then(bookings => {
        const dates = new Set<string>();
        const slots = new Set<string>();
        bookings
          .filter(b => b.status === "CONFIRMED" || b.status === "PENDING")
          .forEach(b => {
            dates.add(b.bookingDate);
            slots.add(`${b.bookingDate}_${b.startTime}`);
          });
        setBookedDates(dates);
        setBookedSlots(slots);
      })
      .catch(() => { })
      .finally(() => setLoadingSchedule(false));
  }, [artistId]);

  const isSlotBooked = useCallback((time: string) => {
    if (!selectedDate) return false;
    return bookedSlots.has(`${selectedDate}_${time}`);
  }, [selectedDate, bookedSlots]);

  const basePrice = service?.priceFrom ?? 0;
  const depositAmount = Math.round(basePrice * 0.55);

  const handleSubmit = async () => {
    if (!serviceId || !artistId) {
      setError("Thiếu thông tin Dịch vụ hoặc Chuyên viên.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn ngày và giờ.");
      return;
    }


    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await createBooking({
        serviceId,
        ownerId: artistId,
        bookingDate: selectedDate,
        startTime: selectedTime,
        promoCode: promoCode.trim() || undefined,
      });

      setSuccessMsg("Đặt lịch thành công! Đang chuyển về trang thông tin của bạn...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: string | { message?: string } } })?.response?.data;
      const errorText = typeof msg === "string" ? msg : (msg?.message ?? "Đặt lịch thất bại. Vui lòng thử lại.");
      setError(errorText);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: 24, padding: 0 }}>
          <ChevronLeft size={18} /> Quay lại
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 28, marginTop: 0 }}>Đặt lịch dịch vụ</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {service && (
              <SectionCard title="Thông tin dịch vụ">
                <div style={{ display: "flex", gap: 16 }}>
                  <Image src={service.imageUrl} alt={service.title} width={96} height={96} unoptimized style={{ borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{service.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: service.artistColor, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {service.artistInitials}
                      </div>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{service.artistName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} style={{ color: "#f59e0b", fill: i < Math.round(service.rating) ? "#f59e0b" : "#e5e7eb" }} />
                      ))}
                      <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 2 }}>({service.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard title="Chọn ngày" icon={<Calendar size={16} style={{ color: "#ec4899" }} />}>
              {loadingSchedule ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: 13 }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Đang tải lịch thợ trang điểm...
                  <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </div>
              ) : (
                <MiniCalendar selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }} bookedDates={bookedDates} />
              )}
            </SectionCard>

            <SectionCard title="Chọn giờ bắt đầu" icon={<Clock size={16} style={{ color: "#ec4899" }} />}>
              {!selectedDate ? (
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Chọn ngày trước để xem khung giờ</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {TIME_SLOTS.map(slot => {
                    const booked = isSlotBooked(slot);
                    const active = selectedTime === slot;
                    return (
                      <button
                        key={slot} disabled={booked} onClick={() => !booked && setSelectedTime(slot)}
                        style={{
                          padding: "8px 0", borderRadius: 10, fontSize: 13, fontWeight: 500,
                          border: active ? "2px solid #ec4899" : "1.5px solid #e5e7eb",
                          background: active ? "#ec4899" : booked ? "#f3f4f6" : "#fff",
                          color: active ? "#fff" : booked ? "#d1d5db" : "#374151",
                          cursor: booked ? "not-allowed" : "pointer",
                          textDecoration: booked ? "line-through" : "none",
                        }}
                      >
                        {slot.slice(0, 5)}
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Mã giảm giá" icon={<Tag size={16} style={{ color: "#ec4899" }} />}>
              <div style={{ display: "flex", gap: 10, border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                <input type="text" placeholder="Nhập mã giảm giá (nếu có)" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} style={{ flex: 1, border: "none", outline: "none", padding: "12px 16px", fontSize: 14, color: "#374151", background: "transparent" }} />
              </div>
            </SectionCard>
          </div>

          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: "#111827" }}>Tóm tắt đặt lịch</h3>
              {service && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{service.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{service.artistName}</p>
                </div>
              )}

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 16 }}>
                <SummaryRow icon={<Calendar size={14} />} label="Ngày" value={selectedDate ? selectedDate.split("-").reverse().join("-") : "Chưa chọn"} empty={!selectedDate} />
                <SummaryRow icon={<Clock size={14} />} label="Giờ" value={selectedTime ? selectedTime.slice(0, 5) : "Chưa chọn"} empty={!selectedTime} />
                {promoCode && <SummaryRow icon={<Tag size={14} />} label="Mã KM" value={promoCode} />}
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Tổng thanh toán</span>
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 700 }}>{formatVND(basePrice)}</span>
                </div>
                <div style={{ background: "#fdf2f8", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#be185d", fontWeight: 600 }}>Cọc trước (55%)</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#ec4899" }}>{formatVND(depositAmount)}</span>
                </div>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fef2f2", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  <AlertCircle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{error}</p>
                </div>
              )}

              {successMsg && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  <CheckCircle2 size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#16a34a", fontWeight: 500 }}>{successMsg}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !selectedDate || !selectedTime || successMsg !== null}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
                  background: loading || !selectedDate || !selectedTime || successMsg ? "#f3f4f6" : "#ec4899",
                  color: loading || !selectedDate || !selectedTime || successMsg ? "#9ca3af" : "#fff",
                  fontSize: 15, fontWeight: 700, cursor: loading || !selectedDate || !selectedTime || successMsg ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s",
                }}
              >
                {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <User size={16} />}
                Xác nhận Đặt Lịch
              </button>
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
                Bạn sẽ thanh toán đặt cọc sau khi Chủ tiệm xác nhận lịch hẹn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon}
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ icon, label, value, empty }: { icon: React.ReactNode; label: string; value: string; empty?: boolean; }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: empty ? "#d1d5db" : "#111827" }}>{value}</span>
    </div>
  );
}