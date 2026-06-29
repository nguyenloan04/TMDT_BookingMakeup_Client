// export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "PAID" | "COMPLETED" | "CANCELLED";

export interface CreateBookingRequest {
  serviceId: string;
  ownerId: string;
  //TODO: Add artistId here if need
  bookingDate: string;
  startTime: string;
  promoCode?: string;
}

export interface BookingDto {
  id: string;
  customerId: string;
  customerDisplayName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  artistId: string;
  artistName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  depositAmount: number;
  platformFee: number;
  status: BookingStatus;
}
