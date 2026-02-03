"use server";

import { GoogleBusinessService } from "@/lib/services/google-business";
import { GbpApiService } from "@/lib/server/gbp-api";
import { AIBackgroundService } from "@/lib/services/ai-background";
import { User } from "@/lib/types";

/**
 * Fetches reviews for a property.
 * This still uses the service-layer logic which defaults to Firestore cache.
 */
export async function getReviewsAction(propertyId: string, user: User | null) {
    try {
        return await GoogleBusinessService.getReviews(propertyId, user);
    } catch (error) {
        console.error("Action error in getReviewsAction:", error);
        throw error;
    }
}

/**
 * Posts a reply to a Google review using the real GBP API.
 */
export async function replyToReviewAction(locationName: string, reviewId: string, replyText: string) {
    try {
        await GbpApiService.replyToReview(locationName, reviewId, replyText);
        return { success: true };
    } catch (error) {
        console.error("Action error in replyToReviewAction:", error);
        throw error;
    }
}

/**
 * Triggers a manual sync of reviews from Google Business Profile.
 */
export async function syncGbpReviewsAction() {
    try {
        return await GbpApiService.syncAllReviews();
    } catch (error) {
        console.error("Action error in syncGbpReviewsAction:", error);
        throw error;
    }
}

/**
 * Triggers an AI audit of reviews in the Firestore cache.
 */
export async function triggerAiAuditAction() {
    try {
        await AIBackgroundService.processPendingReviews();
        return { success: true };
    } catch (error) {
        console.error("Action error in triggerAiAuditAction:", error);
        throw error;
    }
}
