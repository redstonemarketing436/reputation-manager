"use server";

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Review } from '../types';

const GBP_API_VERSION = 'v1';

/**
 * Server-only service for GBP API interactions.
 * This separates the heavy `googleapis` dependency from client-side imports.
 */
export const GbpApiService = {
    /**
     * Reconstitutes an OAuth2 client from stored credentials.
     */
    async getOAuth2Client(): Promise<OAuth2Client | null> {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

        if (!clientId || !clientSecret) {
            console.error('Missing Google OAuth credentials in env.');
            return null;
        }

        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        // Fetch tokens from Firestore
        const authSnap = await getDoc(doc(db, 'settings', 'gbp_auth'));
        if (!authSnap.exists()) {
            console.warn('No GBP auth tokens found in Firestore.');
            return null;
        }

        const tokens = authSnap.data();
        oauth2Client.setCredentials(tokens);

        // Monitor for refresh events and persist
        oauth2Client.on('tokens', async (newTokens) => {
            if (newTokens.refresh_token) {
                await setDoc(doc(db, 'settings', 'gbp_auth'), newTokens, { merge: true });
            }
        });

        return oauth2Client;
    },

    /**
     * Fetches all locations for the authenticated account and syncs reviews to Firestore.
     */
    async syncAllReviews(): Promise<{ success: boolean; count: number }> {
        const auth = await this.getOAuth2Client();
        if (!auth) return { success: false, count: 0 };

        const client = google.mybusinessbusinessinformation({ version: GBP_API_VERSION, auth });
        const accountClient = google.mybusinessaccountmanagement({ version: 'v1', auth });

        try {
            // 1. Get Accounts
            const accountsRes = await accountClient.accounts.list();
            const accounts = accountsRes.data.accounts || [];
            let totalCount = 0;

            for (const account of accounts) {
                // 2. Get Locations
                const locationsRes = await client.accounts.locations.list({
                    parent: account.name,
                    readMask: 'name,title,storeCode'
                });
                const locations = locationsRes.data.locations || [];

                for (const location of locations) {
                    // 3. Get Reviews for each location (via My Business Reviews API)
                    // Note: Reviews API is separate from Business Information
                    const reviewsClient = google.mybusinessreviews({ version: 'v1', auth });
                    const reviewsRes = await reviewsClient.accounts.locations.reviews.list({
                        parent: location.name
                    });

                    const gbpReviews = reviewsRes.data.reviews || [];

                    // 4. Transform and persist to Firestore
                    for (const gbpReview of gbpReviews) {
                        const reviewId = gbpReview.reviewId!;
                        const transformed: Partial<Review> = {
                            id: reviewId,
                            author: gbpReview.reviewer?.displayName || 'Anonymous',
                            rating: gbpReview.starRating === 'FIVE' ? 5 :
                                gbpReview.starRating === 'FOUR' ? 4 :
                                    gbpReview.starRating === 'THREE' ? 3 :
                                        gbpReview.starRating === 'TWO' ? 2 : 1,
                            content: gbpReview.comment || '',
                            date: gbpReview.createTime!,
                            status: gbpReview.reviewReply ? 'Replied' : 'PENDING',
                            propertyId: location.storeCode || 'UNKNOWN'
                        };

                        // Sync to properties sub-collection as requested
                        if (location.storeCode) {
                            await setDoc(doc(db, 'properties', location.storeCode, 'reviews', reviewId), {
                                ...transformed,
                                updatedAt: serverTimestamp()
                            }, { merge: true });
                        }

                        // Sync to global reviews for general dashboard usage
                        await setDoc(doc(db, 'reviews', reviewId), {
                            ...transformed,
                            updatedAt: serverTimestamp()
                        }, { merge: true });

                        totalCount++;
                    }
                }
            }

            return { success: true, count: totalCount };
        } catch (error) {
            console.error('Failed to sync reviews:', error);
            throw error;
        }
    },

    /**
     * Posts a reply to a specific review.
     */
    async replyToReview(locationName: string, reviewId: string, replyText: string): Promise<void> {
        const auth = await this.getOAuth2Client();
        if (!auth) throw new Error('Unauthorized');

        const reviewsClient = google.mybusinessreviews({ version: 'v1', auth });

        try {
            await reviewsClient.accounts.locations.reviews.updateReply({
                name: `${locationName}/reviews/${reviewId}/reply`,
                requestBody: { comment: replyText }
            });
            console.log(`[GBP API] Replied to review ${reviewId}`);
        } catch (error) {
            console.error('Error in GBP API replyToReview:', error);
            throw error;
        }
    }
};
