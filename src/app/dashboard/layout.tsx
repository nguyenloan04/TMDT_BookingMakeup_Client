"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useSyncExternalStore } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Home,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Playwrite_US_Trad } from "next/font/google";

const logoFont = Playwrite_US_Trad({
  weight: ["400"],
});

const emptySubscribe = () => () => { };

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router, mounted]);

  if (!mounted || authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
        <p className="text-gray-500 font-medium">Đang xác thực phiên đăng nhập...</p>
      </div>
    );
  }

  const dbRole = String(user?.role) === "ADMIN" || user?.role === 1 ? "admin" : "customer";
  const currentRole = searchParams.get("role") || dbRole;

  const handleRoleChange = (role: string) => {
    router.push(`/dashboard?role=${role}`);
  };

  return (
    <div className="flex h-screen bg-[#FDFBFD] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-8 flex flex-col h-[75%]">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 group shrink-0"
            href="/"
          >
            <div className="bg-[#E4187D] rounded-full p-1.5 flex items-center justify-center transition-colors group-hover:bg-[#c9126b] shadow-sm">
              <Palette className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className={`text-2xl text-[#E4187D] tracking-tight hidden sm:block ${logoFont.className}`}>
              BookingMakeup
            </span>
          </Link>

          {/* Sidebar Nav */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            <div className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-3 px-3">Hệ thống</div>

            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-pink-50/50 hover:text-[#E4187D] transition-colors text-sm font-semibold">
              <Home className="w-4 h-4 text-gray-400" />
              <span>Trang chủ</span>
            </Link>

            <Link href="/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-pink-50/50 hover:text-[#E4187D] transition-colors text-sm font-semibold">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span>Trò chuyện (Chat)</span>
            </Link>
          </nav>
        </div>

        {/* PROFILE CARD & QUICK ROLE TOGGLE */}
        <div className="space-y-4 border-t border-gray-50 pt-5 mt-auto">
          {/* User Details */}
          <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-gray-50/50 border border-gray-100/30">
            <Avatar className="h-11 w-11 shrink-0 border border-pink-100/50">
              <AvatarImage src={user.avatar || ""} alt={user.username || ""} className="object-cover" />
              <AvatarFallback className="bg-pink-100 text-[#E4187D] text-sm font-black">
                {user.username ? user.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-900 truncate">{user.displayName || user.username}</h4>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Quick Role Toggle */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-pink-50/30 border border-pink-100/30">
            <label className="text-[10px] font-extrabold text-pink-700 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E4187D]" /> Giả lập vai trò (Test)
            </label>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full border border-pink-200/50 rounded-lg p-2 bg-white text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-300 cursor-pointer"
            >
              <option value="customer">Khách Hàng (Customer)</option>
              <option value="so">Chủ Studio (Service Owner)</option>
              <option value="admin">Quản Trị Viên (Admin)</option>
            </select>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={() => logout()}
            className="w-full justify-start rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-gray-50/30">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-gray-900">Bảng Điều Khiển</h2>
            <Badge className="bg-[#E4187D] text-white hover:bg-[#E4187D] capitalize text-[10px] font-bold tracking-wider">
              {currentRole === "so" ? "Service Owner" : currentRole}
            </Badge>
          </div>
          <div className="text-xs text-gray-400">
            Hôm nay: {new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Scrollable Panel Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
        <p className="text-gray-500 font-medium">Đang tải...</p>
      </div>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}