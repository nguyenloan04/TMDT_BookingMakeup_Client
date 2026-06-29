"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageCircleMore } from "lucide-react";
import ChatBox from "./chat-box";
import { ChatRoom } from "@/types/chat";
import { chatService } from "@/services/chat-service";

interface ChatDashboardProps {
    currentUserId: string;
    apiUrl: string;
    initialTargetUserId?: string | null;
    initialTargetName?: string | null;
    initialTargetAvatar?: string | null;
}

export default function ChatDashboard({
    currentUserId,
    apiUrl,
    initialTargetUserId,
    initialTargetName,
    initialTargetAvatar
}: ChatDashboardProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            let loadedRooms: ChatRoom[] = [];

            try {
                loadedRooms = await chatService.getChatRooms(apiUrl, currentUserId);
            } catch (error) {
                console.warn("User chưa có phòng chat nào trên server:", error);
                loadedRooms = [];
            }

            if (initialTargetUserId) {
                const existingRoom = loadedRooms.find(r => r.recipientId === initialTargetUserId);

                if (existingRoom) {
                    setSelectedRoom(existingRoom);
                } else {
                    const tempRoom: ChatRoom = {
                        id: `temp_${initialTargetUserId}`,
                        recipientId: initialTargetUserId,
                        recipientName: initialTargetName || "Artist",
                        recipientAvatar: initialTargetAvatar || "",
                        lastMessage: "Bắt đầu cuộc trò chuyện mới...",
                        lastMessageTime: "Bây giờ",
                        unreadCount: 0
                    };
                    loadedRooms = [tempRoom, ...loadedRooms];
                    setSelectedRoom(tempRoom);
                }
            }

            setRooms(loadedRooms);
        };

        if (currentUserId) fetchRooms();
    }, [apiUrl, currentUserId, initialTargetUserId, initialTargetName, initialTargetAvatar]);

    const filteredRooms = rooms.filter(room => {
        const matchesFilter = filter === "UNREAD" ? room.unreadCount > 0 : true;
        const matchesSearch = room.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">
                    <div className="p-4 relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-7 top-7" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm cuộc trò chuyện..."
                            className="pl-10 bg-[#F3F4F6] border-none rounded-lg text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300"
                        />
                    </div>

                    <div className="flex gap-2 px-4 pb-3 border-b border-gray-50">
                        <button
                            onClick={() => setFilter("ALL")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${filter === "ALL" ? "bg-[#E4187D] text-white" : "bg-[#F3F4F6] text-gray-500"
                                }`}
                        >
                            TẤT CẢ
                        </button>
                        <button
                            onClick={() => setFilter("UNREAD")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${filter === "UNREAD" ? "bg-[#E4187D] text-white" : "bg-[#F3F4F6] text-gray-500"
                                }`}
                        >
                            CHƯA ĐỌC
                        </button>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredRooms.map((room) => {
                                const isSelected = selectedRoom?.recipientId === room.recipientId;
                                return (
                                    <div
                                        key={room.id}
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected ? "bg-[#FFF0F6] border-l-4 border-[#E4187D]" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar className="w-11 h-11 border border-pink-100">
                                                <AvatarImage src={room.recipientAvatar} alt={room.recipientName} className="object-cover" />
                                                <AvatarFallback className="bg-pink-100 text-[#E4187D] font-bold">
                                                    {room.recipientName ? room.recipientName[0].toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">{room.recipientName}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium shrink-0">{room.lastMessageTime}</span>
                                            </div>
                                            <p className={`text-xs truncate ${room.unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                                                {room.lastMessage}
                                            </p>
                                        </div>

                                        {room.unreadCount > 0 && (
                                            <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#E4187D] rounded-full shrink-0">
                                                {room.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </aside>

                <main className="flex-1 flex flex-col bg-white">
                    {selectedRoom ? (
                        <ChatBox
                            currentUserId={currentUserId}
                            recipientId={selectedRoom.recipientId}
                            recipientName={selectedRoom.recipientName}
                            recipientAvatar={selectedRoom.recipientAvatar}
                            apiUrl={apiUrl}
                        />
                    ) : (
                        <EmptyState />
                    )}
                </main>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 text-center bg-white p-8">
            <div className="mb-6">
                <Avatar className="w-24 h-24 rounded-2xl border-2 border-gray-100">
                    <AvatarImage src="" alt="Artist profile default" />
                    <AvatarFallback className="bg-pink-50 text-[#E4187D] rounded-2xl">
                        <MessageCircleMore size={"3rem"} />
                    </AvatarFallback>
                </Avatar>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Kết nối với Artist</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
                Chọn một cuộc hội thoại từ danh sách bên trái hoặc truy cập hồ sơ Artist để bắt đầu trò chuyện.
            </p>
        </div>
    );
}