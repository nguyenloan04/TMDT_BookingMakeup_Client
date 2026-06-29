import axios from "axios";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { PageResponse } from "@/types/page-response";

export const chatService = {
    getChatRooms: async (apiUrl: string, userId: string): Promise<ChatRoom[]> => {
        const response = await axios.get<ChatRoom[]>(`${apiUrl}/chat/rooms/${userId}`);
        return response.data;
    },

    getChatMessages: async (
        apiUrl: string,
        senderId: string,
        recipientId: string,
        page = 0,
        size = 20
    ): Promise<PageResponse<ChatMessage>> => {
        const response = await axios.get<PageResponse<ChatMessage>>(
            `${apiUrl}/chat/messages/${senderId}/${recipientId}`,
            {
                params: {
                    page,
                    size
                }
            }
        );
        return response.data;
    },

    markAsRead: async (apiUrl: string, chatId: string, readerId: string): Promise<void> => {
        await axios.post(`${apiUrl}/api/chat/read`, {
            chatId,
            recipientId: readerId
        });
    }
};