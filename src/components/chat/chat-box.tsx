"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@stomp/stompjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, MoreVertical, Plus, Image as ImageIcon, Smile, Check, CheckCheck } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { chatService } from "@/services/chat-service";

interface ChatFormValues {
    content: string;
}

interface ChatBoxProps {
    currentUserId: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    apiUrl: string;
}

export default function ChatBox({ currentUserId, recipientId, recipientName, recipientAvatar, apiUrl }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const isRecipientOnline = onlineUsers.includes(recipientId);

    const stompClientRef = useRef<Client | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const roomId = currentUserId.localeCompare(recipientId) < 0
        ? `${currentUserId}_${recipientId}`
        : `${recipientId}_${currentUserId}`;

    const { register, handleSubmit, reset } = useForm<ChatFormValues>({
        defaultValues: { content: "" },
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const loadHistoryMessages = async () => {
            if (!currentUserId || !recipientId || currentUserId === "undefined" || recipientId === "undefined") return;
            try {
                const response = await chatService.getChatMessages(apiUrl, currentUserId, recipientId, 0, 50);
                if (response && response.content) {
                    const sortedMessages = [...response.content].sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );
                    setMessages(sortedMessages);
                }
            } catch (error) {
                console.error("Failed to load history messages:", error);
                setMessages([]);
            }
        };
        loadHistoryMessages();
    }, [roomId, apiUrl, currentUserId, recipientId]);

    useEffect(() => {
        const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";

        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: {
                userId: currentUserId
            },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/presence`, (message) => {
                    if (message.body) {
                        const users = JSON.parse(message.body);
                        setOnlineUsers(users);
                    }
                });

                client.publish({ destination: "/app/chat.presence" });

                client.subscribe(`/user/${currentUserId}/queue/messages`, (message) => {
                    if (message.body) {
                        const data = JSON.parse(message.body);
                        if (data.sender && typeof data.sender === 'object') {
                            const receivedMessage: ChatMessage = data;
                            setMessages((prev) => [...prev, receivedMessage]);

                            client.publish({
                                destination: "/app/chat.read",
                                body: JSON.stringify({
                                    chatId: roomId,
                                    senderId: receivedMessage.sender.id,
                                    recipientId: currentUserId
                                })
                            });
                        } else if (data.senderId && data.chatId) {
                            setMessages((prev) =>
                                prev.map(msg =>
                                    (msg.sender.id === currentUserId && msg.status !== "READ")
                                        ? { ...msg, status: "READ" }
                                        : msg
                                )
                            );
                        }
                    }
                });
            },
            onDisconnect: () => {
                setOnlineUsers([]);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [currentUserId, recipientId, apiUrl, roomId]);

    const onSendMessage = (data: ChatFormValues) => {
        if (!data.content.trim() || !stompClientRef.current?.connected) return;

        const chatDto = {
            chatId: roomId,
            senderId: currentUserId,
            recipientId: recipientId,
            content: data.content,
        };

        stompClientRef.current.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatDto),
        });

        const localMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            content: data.content,
            sender: { id: currentUserId, username: "Me" },
            recipient: { id: recipientId, username: recipientName },
            status: "SENT",
            timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, localMessage]);
        reset();
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA]">
            {/* --- HEADER CHAT --- */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage src={recipientAvatar} alt={recipientName} className="object-cover" />
                            <AvatarFallback className="bg-pink-100 text-[#E4187D] font-bold">
                                {recipientName ? recipientName[0].toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full transition-colors duration-500 ${isRecipientOnline ? "bg-green-500" : "bg-gray-300"
                            }`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{recipientName}</h3>
                        <p className={`text-[11px] font-semibold transition-colors duration-500 ${isRecipientOnline ? "text-green-500" : "text-gray-400"}`}>
                            {isRecipientOnline ? "ĐANG HOẠT ĐỘNG" : "NGOẠI TUYẾN"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    {/* <Button variant="ghost" size="icon" className="text-[#E4187D] hover:bg-pink-50 rounded-full"><Phone className="w-5 h-5" /></Button> */}
                    {/* <Button variant="ghost" size="icon" className="text-[#E4187D] hover:bg-pink-50 rounded-full"><Video className="w-5 h-5" /></Button> */}
                    <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                </div>
            </div>

            {/* List message */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.length > 0 && (
                    <div className="text-center text-[10px] bg-gray-100 text-gray-400 rounded-md py-1 px-3 w-max mx-auto mb-2 font-bold tracking-wider shrink-0">HÔM NAY</div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender.id === currentUserId;
                    return (
                        <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${isMe ? "bg-[#E4187D] text-white rounded-br-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"}`}>
                                <p className="break-all">{msg.content}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
                                <span>
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                                {isMe && (
                                    <span className="flex items-center">
                                        {msg.status === "SENT" && <Check className="w-3.5 h-3.5 text-gray-400 ml-0.5" />}
                                        {msg.status === "DELIVERED" && <CheckCheck className="w-3.5 h-3.5 text-gray-400 ml-0.5" />}
                                        {msg.status === "READ" && <CheckCheck className="w-3.5 h-3.5 text-blue-500 ml-0.5" />}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Message form */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSendMessage)(e);
                    }}
                    className="flex items-center gap-3 bg-[#F3F4F6] px-4 py-2 rounded-full"
                >
                    <div className="flex items-center gap-2 text-gray-400 shrink-0">
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-200"><Plus className="w-5 h-5" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-200"><ImageIcon className="w-5 h-5" /></Button>
                    </div>

                    <Input
                        {...register("content")}
                        placeholder="Nhập tin nhắn..."
                        autoComplete="off"
                        className="flex-1 bg-transparent border-none p-0 h-8 shadow-none focus-visible:ring-0 text-sm placeholder:text-gray-400 text-gray-800"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-gray-400 rounded-full hover:bg-gray-200"><Smile className="w-5 h-5" /></Button>
                        <Button
                            type="submit"
                            size="icon"
                            className="w-9 h-9 rounded-full bg-[#E4187D] hover:bg-[#c9126b] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}