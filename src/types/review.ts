export type CommentTag = "NICE_ATTITUDE" | "GOOD_SERVICE" | "ON_TIME" | "BAD_SERVICE" | "WORST_ATTITUDE";

export interface ReviewDto {
    id: string;
    customer: string;
    service: string;
    rating: number;
    comment: string;
    date: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
}

export interface CreateReviewRequest {
    bookingId: string;
    bookingRating: number;
    artistRating: number;
    comment: string;
    images?: string;
    tags: CommentTag;
}
