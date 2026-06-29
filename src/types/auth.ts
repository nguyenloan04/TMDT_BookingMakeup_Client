export interface AuthDto {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    gender: number;
    avatar: string | null;
    description: string | null;
    isActive: boolean;
    isVerified: boolean;
    role: "USER" | "ADMIN" | "SERVICE_OWNER" | "SO" | number;
    jwtToken: string | null;
}

export interface AuthResponse {
    result: boolean;
    message: string;
    authDto: AuthDto | null;
}
