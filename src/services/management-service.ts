import apiClient from "@/common/constant/api-client";

export interface ManagementServiceDto {
    id: string;
    ownerId?: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    duration: number;
    isActive: boolean;
    rating: number;
}

export interface CreateServiceRequest {
    name: string;
    description?: string;
    price: number;
    category: string;
    duration: number;
}

export interface UpdateServiceRequest {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    duration?: number;
    isActive?: boolean;
}

export const getAllServices = async (): Promise<ManagementServiceDto[]> => {
    const response = await apiClient.get<ManagementServiceDto[]>('/services');
    return response.data;
};

export const getServiceById = async (id: string): Promise<ManagementServiceDto> => {
    const response = await apiClient.get<ManagementServiceDto>(`/services/${id}`);
    return response.data;
};

export const createService = async (data: CreateServiceRequest): Promise<ManagementServiceDto> => {
    const response = await apiClient.post<ManagementServiceDto>('/services', data);
    return response.data;
};

export const updateService = async (id: string, data: UpdateServiceRequest): Promise<ManagementServiceDto> => {
    const response = await apiClient.put<ManagementServiceDto>(`/services/${id}`, data);
    return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
};
