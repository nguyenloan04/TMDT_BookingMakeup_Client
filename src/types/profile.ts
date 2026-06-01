export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    phone: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    role: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    address: string;
    totalPoints: number;
}

export interface UpdateProfileRequest {
    displayName?: string;
    avatarUrl?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
}

export interface ChangePasswordRequest {
    oldPassword?: string;
    newPassword?: string;
}
