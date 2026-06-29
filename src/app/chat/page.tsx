"use client"

import { apiUrl } from "@/common/constant/api-url";
import ChatDashboard from "@/components/chat/chat-dashboard";
import Header from "@/components/header";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ChatPageContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();

    if (!user) return null;

    if (!user?.id) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
                <p className="text-sm text-gray-500 animate-pulse">Đang nạp dữ liệu phiên làm việc...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 min-h-0 bg-white">
                <ChatDashboard
                    currentUserId={user.id}
                    apiUrl={apiUrl}
                    initialTargetUserId={searchParams.get("userId")}
                    initialTargetName={searchParams.get("name")}
                    initialTargetAvatar={searchParams.get("avatar")}
                />
            </main>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
                <p className="text-sm text-gray-500 animate-pulse">Đang tải...</p>
            </div>
        }>
            <ChatPageContent />
        </Suspense>
    );
}