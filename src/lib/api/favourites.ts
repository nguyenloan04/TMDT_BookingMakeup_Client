import { ServiceDto } from "@/types/service";
import apiClient from "./client";

// Thêm dịch vụ vào yêu thích
export async function addFavourite(serviceId: string): Promise<string> {
  const { data } = await apiClient.post<string>(`/favourites/${serviceId}`);
  return data;
}

// Xóa dịch vụ khỏi yêu thích
export async function removeFavourite(serviceId: string): Promise<string> {
  const { data } = await apiClient.delete<string>(`/favourites/${serviceId}`);
  return data;
}

// Lấy danh sách dịch vụ yêu thích
export async function getFavourites(): Promise<ServiceDto[]> {
  const { data } = await apiClient.get<ServiceDto[]>("/favourites");
  return data;
}

// Kiểm tra trạng thái yêu thích của dịch vụ
export async function isFavourite(serviceId: string): Promise<boolean> {
  const { data } = await apiClient.get<boolean>(`/favourites/${serviceId}/status`);
  return data;
}

export interface FavouriteAdminDto {
  id: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  artistName: string;
}

// Lấy toàn bộ danh sách yêu thích cho Admin
export async function getAllFavouritesAdmin(): Promise<FavouriteAdminDto[]> {
  const { data } = await apiClient.get<FavouriteAdminDto[]>("/favourites/admin");
  return data;
}

// Xóa một liên kết yêu thích theo ID (Admin)
export async function deleteFavouriteAdmin(id: number): Promise<string> {
  const { data } = await apiClient.delete<string>(`/favourites/admin/${id}`);
  return data;
}
