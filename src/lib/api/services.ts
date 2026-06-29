import { ServiceDto } from "@/types/service";
import apiClient from "./client";

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  duration: number;
  imageUrl?: string;
}

export interface UpdateServiceRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  duration: number;
  isActive: boolean;
  imageUrl?: string;
}

// Lấy toàn bộ dịch vụ active (Public)
export async function getAllServices(): Promise<ServiceDto[]> {
  const { data } = await apiClient.get<ServiceDto[]>("/services");
  return data;
}

// Lấy danh sách dịch vụ của SO hiện tại (Protected)
export async function getMyServices(): Promise<ServiceDto[]> {
  const { data } = await apiClient.get<ServiceDto[]>("/services/my-services");
  return data;
}

// Lấy chi tiết dịch vụ
export async function getServiceById(id: string): Promise<ServiceDto> {
  const { data } = await apiClient.get<ServiceDto>(`/services/${id}`);
  return data;
}

// Tạo dịch vụ mới (SO)
export async function createService(payload: CreateServiceRequest): Promise<ServiceDto> {
  const { data } = await apiClient.post<ServiceDto>("/services", payload);
  return data;
}

// Cập nhật dịch vụ (SO)
export async function updateService(id: string, payload: UpdateServiceRequest): Promise<ServiceDto> {
  const { data } = await apiClient.put<ServiceDto>(`/services/${id}`, payload);
  return data;
}

// Xóa dịch vụ (SO)
export async function deleteService(id: string): Promise<string> {
  const { data } = await apiClient.delete<string>(`/services/${id}`);
  return data;
}
