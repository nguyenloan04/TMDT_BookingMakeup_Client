export interface Artist {
  id: string;
  artistName: string;
  specialization: string;
  portfolioImages: string;
  averageRating: number;
  reviewCount: number;
  followCount: number;
  ownerId: string;
  ownerName: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerDisplayName: string;
  serviceId: string;
  serviceName: string;
  artistId: string;
  artistName: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm:ss
  endTime: string;
  totalAmount: number;
  depositAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
}
export interface FeaturedArtistDto {
    id: string;
    displayName: string;
    specialty: string;
    rating: number;
    reviewsCount?: number;
    priceFrom?: number;
    avatarUrl: string | null;
}

export interface ServiceSimpleDto {
    id: string;
    name: string;
    price: number;
    duration: number;
    imageUrl: string;
}

export interface ServiceDetailResponse {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    ownerId: string;
    ownerName: string;
    ownerAvatar: string | null;
    relatedServices: ServiceSimpleDto[];
    mainThumbnailUrl: string;
    rating: number;
    reviewCount: number;
    address: string;
}
