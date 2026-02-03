"use server";

import { GoogleBusinessService } from "@/lib/services/google-business";

export async function getReviewsAction(propertyId: string) {
    // Note: In a real app, we'd get the user session here
    // For now, we'll pass null or a mock user until the DB is ready
    return GoogleBusinessService.fetchAllReviews(propertyId, {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        assignedProperties: ['ALL']
    });
}

export async function replyToReviewAction(reviewId: string, replyText: string) {
    return GoogleBusinessService.replyToReview(reviewId, replyText);
}
