export interface MakeupService {
  // id: number;
  serviceUuid: string;   // UUID thực dùng khi tạo booking
  artistUuid: string;    // UUID artist thực dùng khi tạo booking
  title: string;
  category: string;
  categoryTag: string;
  categoryTagColor: string;
  artistName: string;
  artistInitials: string;
  artistColor: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  duration: number | null;  // thời lượng dịch vụ (phút)
  imageUrl: string;
  location: string;
  description: string;
}

export interface SearchResponse {
  services: MakeupService[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  keyword?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface ServiceDto {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  duration: number;
  isActive: boolean;
  rating: number;
  imageUrl?: string;
}

