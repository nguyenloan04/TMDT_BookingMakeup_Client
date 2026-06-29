// import { apiUrl } from "@/common/constant/api-url";

// export interface CloudinaryUploadSignature {
//     result: boolean;
//     timestamp: number;
//     folder: string;
//     public_id: string;
//     signature: string;
//     api_key: string;
//     cloud_name: string;
// }

// export interface CloudinaryUploadResult {
//     secure_url: string;
//     public_id: string;
// }

// interface MultipleAttachmentResponse {
//     result: boolean;
//     signatures: Array<{
//         folder: string;
//         signature: string;
//         api_key: string;
//         public_id: string;
//         timestamp: number;
//         cloud_name?: string;
//     }>;
// }

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
// const MAX_FILE_SIZE_MB = 5;

// function getCloudName(): string {
//     const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_STORAGE || "";
//     const match = mediaUrl.match(/res\.cloudinary\.com\/([^/]+)/);
//     return match?.[1] || "doqfquxtc";
// }

// export function validateIdentityImage(file: File): string | null {
//     if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//         return "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP";
//     }
//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//         return `Ảnh không được lớn hơn ${MAX_FILE_SIZE_MB}MB`;
//     }
//     return null;
// }

// export async function getIdentityUploadSignature(fileName: string): Promise<CloudinaryUploadSignature> {
//     const folder = "service-owner/identity";
//     const response = await fetch(
//         `${apiUrl}/upload/upload-multiple-attachment?folder=${encodeURIComponent(folder)}&fileName=${encodeURIComponent(fileName)}&contentType=image`
//     );

//     if (!response.ok) {
//         throw new Error("Không thể lấy chữ ký upload");
//     }

//     const data = (await response.json()) as MultipleAttachmentResponse;
//     const signature = data.signatures?.[0];

//     if (!data.result || !signature) {
//         throw new Error("Không thể lấy chữ ký upload");
//     }

//     return {
//         result: true,
//         timestamp: signature.timestamp,
//         folder: signature.folder,
//         public_id: signature.public_id,
//         signature: signature.signature,
//         api_key: signature.api_key,
//         cloud_name: signature.cloud_name || getCloudName(),
//     };
// }

// export async function uploadImageToCloudinary(
//     file: File,
//     signature: CloudinaryUploadSignature
// ): Promise<string> {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", signature.api_key);
//     formData.append("timestamp", String(signature.timestamp));
//     formData.append("signature", signature.signature);
//     formData.append("folder", signature.folder);
//     formData.append("public_id", signature.public_id);

//     const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${signature.cloud_name}/image/upload`,
//         {
//             method: "POST",
//             body: formData,
//         }
//     );

//     if (!response.ok) {
//         const errorBody = await response.text();
//         throw new Error(errorBody || "Upload ảnh lên cloud thất bại");
//     }

//     const data = (await response.json()) as CloudinaryUploadResult;
//     if (!data.secure_url) {
//         throw new Error("Không nhận được link ảnh từ cloud");
//     }

//     return data.secure_url;
// }

// export async function uploadIdentityImage(file: File, side: "front" | "back"): Promise<string> {
//     const validationError = validateIdentityImage(file);
//     if (validationError) {
//         throw new Error(validationError);
//     }

//     const extension = file.name.split(".").pop() || "jpg";
//     const fileName = `identity-${side}-${Date.now()}.${extension}`;
//     const signature = await getIdentityUploadSignature(fileName);
//     return uploadImageToCloudinary(file, signature);
// }
import { apiUrl } from "@/common/constant/api-url";

export interface CloudinaryUploadSignature {
    result: boolean;
    timestamp: number;
    folder: string;
    public_id: string;
    signature: string;
    api_key: string;
    cloud_name: string;
}

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

interface MultipleAttachmentResponse {
    result: boolean;
    signatures: Array<{
        folder: string;
        signature: string;
        api_key: string;
        public_id: string;
        timestamp: number;
        cloud_name?: string;
    }>;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE_MB = 5;

function getCloudName(): string {
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_STORAGE || "";
    const match = mediaUrl.match(/res\.cloudinary\.com\/([^/]+)/);
    return match?.[1] || "doqfquxtc";
}

// Đổi tên hàm validate cho tổng quát (tùy chọn)
export function validateImage(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `Ảnh không được lớn hơn ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
}

// 1. HÀM XIN CHỮ KÝ DÙNG CHUNG (Nhận tham số folder)
export async function getUploadSignature(fileName: string, folder: string): Promise<CloudinaryUploadSignature> {
    const response = await fetch(
        `${apiUrl}/upload/upload-multiple-attachment?folder=${encodeURIComponent(folder)}&fileName=${encodeURIComponent(fileName)}&contentType=image`
    );

    if (!response.ok) throw new Error("Không thể lấy chữ ký upload");

    const data = (await response.json()) as MultipleAttachmentResponse;
    const signature = data.signatures?.[0];

    if (!data.result || !signature) throw new Error("Không thể lấy chữ ký upload");

    return {
        result: true,
        timestamp: signature.timestamp,
        folder: signature.folder,
        public_id: signature.public_id,
        signature: signature.signature,
        api_key: signature.api_key,
        cloud_name: signature.cloud_name || getCloudName(),
    };
}

// 2. HÀM ĐẨY ẢNH LÊN CLOUD DÙNG CHUNG (Giữ nguyên của bạn)
export async function uploadImageToCloudinary(file: File, signature: CloudinaryUploadSignature): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.api_key);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);
    formData.append("public_id", signature.public_id);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloud_name}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "Upload ảnh lên cloud thất bại");
    }

    const data = (await response.json()) as CloudinaryUploadResult;
    if (!data.secure_url) throw new Error("Không nhận được link ảnh từ cloud");

    return data.secure_url;
}

// ==========================================
// CÁC HÀM TIỆN ÍCH CHO TỪNG NGHIỆP VỤ
// ==========================================

// Nghiệp vụ 1: Up ảnh CCCD
export async function uploadIdentityImage(file: File, side: "front" | "back"): Promise<string> {
    const validationError = validateImage(file);
    if (validationError) throw new Error(validationError);

    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `identity-${side}-${Date.now()}.${extension}`;
    
    // Gọi hàm dùng chung và truyền folder vào
    const signature = await getUploadSignature(fileName, "service-owner/identity");
    return uploadImageToCloudinary(file, signature);
}

// Nghiệp vụ 2: Up ảnh Artist
export async function uploadArtistImage(file: File): Promise<string> {
    const validationError = validateImage(file);
    if (validationError) throw new Error(validationError);

    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `artist-${Date.now()}.${extension}`;
    
    // Gọi hàm dùng chung và truyền folder vào
    const signature = await getUploadSignature(fileName, "artists/avatars");
    return uploadImageToCloudinary(file, signature);
}

// Nghiệp vụ 3: Up ảnh Service
export async function uploadServiceImage(file: File): Promise<string> {
    const validationError = validateImage(file);
    if (validationError) throw new Error(validationError);

    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `service-${Date.now()}.${extension}`;
    
    // Gọi hàm dùng chung và truyền folder vào
    const signature = await getUploadSignature(fileName, "services/images");
    return uploadImageToCloudinary(file, signature);
}