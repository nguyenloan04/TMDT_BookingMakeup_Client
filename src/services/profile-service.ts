import apiClient from "@/common/constant/api-client";
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from "@/types/profile";

export const getProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/profile');
    return response.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/profile', data);
    return response.data;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<string> => {
    const response = await apiClient.put<string>('/users/password', data);
    return response.data;
};
