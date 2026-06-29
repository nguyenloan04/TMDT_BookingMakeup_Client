import apiClient from '@/common/constant/api-client'; // Điều chỉnh đường dẫn này nếu cần
import { Artist, Booking,ServiceDetailResponse } from '@/types/artist';
import { apiUrl } from "@/common/constant/api-url";
import { ProviderProfileResponse } from "@/types/service-provider";

export const artistService = {
  // Lấy danh sách thợ của SO
  getMyArtists: async (): Promise<Artist[]> => {
    // Axios tự động gắn token từ interceptor và nối baseURL
    const response = await apiClient.get('/artists/my-artists');
    return response.data; 
  },

  // Lấy chi tiết thợ
  getArtistById: async (id: string): Promise<Artist> => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },

  // Lấy lịch làm việc của thợ
  getArtistBookings: async (artistId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/artist/${artistId}`);
    return response.data;
  },
  createArtist: async (data: { artistName: string; specialization: string; portfolioImages: string }): Promise<Artist> => {
    const response = await apiClient.post('/artists', data);
    return response.data;
  },
  toggleFollow: async (artistId: string): Promise<void> => {
    await apiClient.post(`/artists/${artistId}/follow`);
  },

  checkFollowStatus: async (artistId: string): Promise<boolean> => {
    const response = await apiClient.get(`/artists/${artistId}/follow-status`);
    return response.data;
  }
};

export const getProviderProfile = async (id: string): Promise<ProviderProfileResponse | null> => {
    try {
        const res = await fetch(`${apiUrl}/profile/providers/${id}`);
        if (!res.ok) return null;

        const result = await res.json() as ProviderProfileResponse;
        console.log(result)
        return result
    } catch (error) {
        console.error("Lỗi fetch provider profile:", error);
        return null;
    }
};

export const getServiceDetail = async (id: string): Promise<ServiceDetailResponse | null> => {
    try {
        const res = await fetch(`${apiUrl}/profile/providers/services/${id}`);
        if (!res.ok) return null;
        return await res.json() as ServiceDetailResponse;
    } catch (error) {
        console.error("Lỗi fetch service detail:", error);
        return null;
    }
};