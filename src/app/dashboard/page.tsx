"use client";

import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import CustomerDashboard from "@/components/dashboard/customer-dashboard";
import SoDashboard from "@/components/dashboard/so-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import { getDashboardRole } from "@/lib/dashboard-role";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
        <p className="text-gray-400 text-sm">Đang tải thông tin bảng điều khiển...</p>
      </div>
    );
  }

  const activeRole = getDashboardRole(user);

  switch (activeRole) {
    case "so":
      return <SoDashboard userId={user.id} />;
    case "admin":
      return <AdminDashboard />;
    case "customer":
    default:
      return <CustomerDashboard />;
  }
}
