"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, ChevronLeft, ChevronRight, Heart, Star, X } from "lucide-react";
import { searchServices } from "@/lib/api/search";
import { MakeupService, SearchResponse } from "@/types/service";

// constants
const CATEGORIES = ["Trang điểm cô dâu", "Thời trang / Sự kiện", "Tiệc tối", "Khóa học"];
const SORT_OPTIONS = [
  { value: "suggested", label: "Gợi ý" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "price_asc", label: "Giá thấp → cao" },
  { value: "price_desc", label: "Giá cao → thấp" },
];
const TAG_COLORS: Record<string, string> = {
  pink: "#ec4899",
  purple: "#a855f7",
  green: "#22c55e",
  gold: "#f59e0b",
};

// ServiceCard
function ServiceCard({ service }: { service: MakeupService }) {
  const [liked, setLiked] = useState(false);
  const tagColor = TAG_COLORS[service.categoryTagColor] ?? "#6b7280";

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      border: "1px solid #f0f0f0",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.2s",
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={service.imageUrl}
          alt={service.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Heart */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "#fff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <Heart size={15} style={{ color: liked ? "#ec4899" : "#9ca3af", fill: liked ? "#ec4899" : "none" }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Artist */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: service.artistColor,
            color: "#fff", fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {service.artistInitials}
          </div>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{service.artistName}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: "#111827",
          lineHeight: 1.4, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {service.title}
        </h3>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} style={{
              color: "#f59e0b",
              fill: i < Math.round(service.rating) ? "#f59e0b" : "#e5e7eb",
            }} />
          ))}
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>
            ({service.reviewCount} đánh giá)
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Giá từ</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#ec4899" }}>
              {new Intl.NumberFormat("vi-VN").format(service.priceFrom)} VND
            </div>
          </div>
          <button style={{
            background: "#111827", color: "#fff",
            border: "none", borderRadius: 12,
            padding: "8px 16px", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => window.location.href = `/services/${service.serviceUuid}`}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page
interface FilterState {
  categories: string[];
  maxPrice: number;
  minRating: number;
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("suggested");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({ categories: [], maxPrice: 1000, minRating: 0 });

  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(async (
    kw: string, loc: string, f: FilterState, sort: string, pg: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchServices({
        keyword: kw,
        location: loc,
        category: f.categories.length === 1 ? f.categories[0] : undefined,
        maxPrice: f.maxPrice < 1000 ? f.maxPrice : undefined,
        minRating: f.minRating > 0 ? f.minRating : undefined,
        sortBy: sort,
        page: pg,
        pageSize: 6,
      });
      setResult(data);
    } catch {
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(keyword, location, filters, sortBy, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, page]);

  const handleSearch = () => { setPage(1); doSearch(keyword, location, filters, sortBy, 1); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  const toggleCategory = (cat: string) => {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters(f => ({ ...f, categories: updated }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ categories: [], maxPrice: 1000, minRating: 0 });
    setPage(1);
  };

  // pagination pages
  const totalPages = result?.totalPages ?? 1;
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Title ── */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 24, marginTop: 0 }}>
          Tìm Kiếm Vẻ Đẹp Hoàn Hảo
        </h1>

        {/* ── Search bar ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {/* keyword */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14,
            padding: "0 16px", height: 52,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <Search size={18} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Tìm kiếm chuyên gia, phong cách..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 14, color: "#374151", background: "transparent",
              }}
            />
          </div>

          {/* location */}
          <div style={{
            width: 180, display: "flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14,
            padding: "0 14px", height: 52,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <MapPin size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Vị trí"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 14, color: "#374151", background: "transparent",
              }}
            />
          </div>

          {/* button */}
          <button
            onClick={handleSearch}
            style={{
              background: "#111827", color: "#fff",
              border: "none", borderRadius: 14,
              padding: "0 28px", height: 52,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Tìm kiếm
          </button>
        </div>

        {/* ── Body: sidebar + results ── */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* ── Sidebar ── */}
          <aside style={{
            width: 220, flexShrink: 0,
            background: "#fff", borderRadius: 16,
            border: "1px solid #f0f0f0",
            padding: "20px 18px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            {/* header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: 1, textTransform: "uppercase" }}>
                Bộ lọc
              </span>
              <button onClick={clearFilters} style={{
                background: "none", border: "none", color: "#ec4899",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                Xóa tất cả
              </button>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginTop: 0 }}>
                Loại dịch vụ
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CATEGORIES.map(cat => {
                  const checked = filters.categories.includes(cat);
                  return (
                    <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div
                        onClick={() => toggleCategory(cat)}
                        style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: checked ? "none" : "2px solid #d1d5db",
                          background: checked ? "#ec4899" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: "#374151" }}>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginTop: 0 }}>
                Khoảng giá
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                <span>$0</span>
                <span>${filters.maxPrice}{filters.maxPrice >= 1000 ? "+" : ""}</span>
              </div>
              <input
                type="range" min={50} max={1000} step={50}
                value={filters.maxPrice}
                onChange={e => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) })); setPage(1); }}
                style={{ width: "100%", accentColor: "#ec4899" }}
              />
            </div>

            {/* Rating */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginTop: 0 }}>
                Đánh giá
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => { setFilters(f => ({ ...f, minRating: f.minRating === star ? 0 : star })); setPage(1); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 1 }}>
                    <Star size={18} style={{
                      color: "#f59e0b",
                      fill: star <= filters.minRating ? "#f59e0b" : "#e5e7eb",
                    }} />
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>trở lên</span>
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                {result ? (
                  <><strong style={{ color: "#111827" }}>{result.totalCount}</strong> dịch vụ tìm thấy trong khu vực của bạn</>
                ) : "Đang tải..."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Sắp xếp theo:
                </span>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1); }}
                  style={{
                    fontSize: 13, border: "1.5px solid #e5e7eb", borderRadius: 10,
                    padding: "6px 12px", outline: "none", background: "#fff", cursor: "pointer",
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* loading */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <Loader2 size={36} style={{ color: "#ec4899", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* error */}
            {error && !loading && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 16, padding: 24, textAlign: "center",
              }}>
                <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 8px" }}>{error}</p>
                <button onClick={handleSearch} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>
                  Thử lại
                </button>
              </div>
            )}

            {/* empty */}
            {!loading && !error && result?.services.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ color: "#9ca3af", fontSize: 16 }}>Không tìm thấy dịch vụ phù hợp.</p>
                <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Thử thay đổi từ khóa hoặc bộ lọc.</p>
              </div>
            )}

            {/* grid */}
            {!loading && !error && result && result.services.length > 0 && (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}>
                  {result.services.map(s => <ServiceCard key={s.serviceUuid} service={s} />)}
                </div>

                {/* pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: "1.5px solid #e5e7eb", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        opacity: page === 1 ? 0.4 : 1,
                      }}
                    >
                      <ChevronLeft size={16} style={{ color: "#6b7280" }} />
                    </button>
                    {pages.map(p => (
                      <button key={p} onClick={() => setPage(p)} style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: p === page ? "none" : "1.5px solid #e5e7eb",
                        background: p === page ? "#ec4899" : "#fff",
                        color: p === page ? "#fff" : "#374151",
                        fontSize: 14, fontWeight: p === page ? 700 : 400,
                        cursor: "pointer",
                      }}>
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: "1.5px solid #e5e7eb", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: page === totalPages ? "not-allowed" : "pointer",
                        opacity: page === totalPages ? 0.4 : 1,
                      }}
                    >
                      <ChevronRight size={16} style={{ color: "#6b7280" }} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
