"use server";

import { GoogleBusinessService } from "@/lib/services/google-business";
import { User } from "@/lib/types";

export async function getReviewsAction(propertyId: string, user: User | null) {
    try {
        return await GoogleBusinessService.fetchAllReviews(propertyId, user);
    } catch (error) {
        console.error("Action error in getReviewsAction:", error);
        throw error;
    }
}

export async function replyToReviewAction(reviewId: string, replyText: string) {
    try {
        return await GoogleBusinessService.replyToReview(reviewId, replyText);
    } catch (error) {
        console.error("Action error in replyToReviewAction:", error);
        throw error;
    }
}
