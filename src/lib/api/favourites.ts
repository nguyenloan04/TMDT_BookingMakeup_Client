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


