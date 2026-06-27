import { ReviewDto, CreateReviewRequest } from "@/types/review";
import apiClient from "./client";

// Gửi đánh giá cho booking đã hoàn thành (Customer)
export async function createReview(payload: CreateReviewRequest): Promise<ReviewDto> {
  const { data } = await apiClient.post<ReviewDto>("/reviews", payload);
  return data;
}

// Lấy danh sách đánh giá của một dịch vụ (Public)
export async function getReviewsByService(serviceId: string): Promise<ReviewDto[]> {
  const { data } = await apiClient.get<ReviewDto[]>(`/reviews/service/${serviceId}`);
  return data;
}

// Lấy danh sách đánh giá của một artist (Public)
export async function getReviewsByArtist(artistId: string): Promise<ReviewDto[]> {
  const { data } = await apiClient.get<ReviewDto[]>(`/reviews/artist/${artistId}`);
  return data;
}

// Lấy tất cả đánh giá của hệ thống (Admin)
export async function getAllReviews(): Promise<ReviewDto[]> {
  const { data } = await apiClient.get<ReviewDto[]>("/reviews");
  return data;
}

// Cập nhật trạng thái đánh giá (Admin)
export async function updateReviewStatus(id: string, status: "APPROVED" | "PENDING" | "REJECTED"): Promise<ReviewDto> {
  const { data } = await apiClient.patch<ReviewDto>(`/reviews/${id}/status`, { status });
  return data;
}

// Xóa đánh giá (Admin)
export async function deleteReview(id: string): Promise<string> {
  const { data } = await apiClient.delete<string>(`/reviews/${id}`);
  return data;
}
