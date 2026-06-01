import apiClient from "@/common/constant/api-client";

export interface ReviewDto {
    id: string;
    customer: string;
    service: string;
    rating: number;
    comment: string;
    date: string;
    status: string;
}

export const getAllReviews = async (): Promise<ReviewDto[]> => {
    const response = await apiClient.get<ReviewDto[]>('/reviews');
    return response.data;
};

export const updateReviewStatus = async (id: string, status: string): Promise<ReviewDto> => {
    const response = await apiClient.patch<ReviewDto>(`/reviews/${id}/status`, { status });
    return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
};
