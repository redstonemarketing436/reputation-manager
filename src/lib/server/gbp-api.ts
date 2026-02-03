"use server";

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Review } from '@/lib/types';

const GBP_API_VERSION = 'v1';

/**
 * Server-only service for GBP API interactions.
 * Uses 'any' casting on googleapis methods to bypass strict callable type errors.
 */
export const GbpApiService = {
    async getOAuth2Client(): Promise<OAuth2Client | null> {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

        if (!clientId || !clientSecret) return null;

        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        const authSnap = await getDoc(doc(db, 'settings', 'gbp_auth'));
        if (!authSnap.exists()) return null;

        oauth2Client.setCredentials(authSnap.data());
        return oauth2Client;
    },

    async syncAllReviews(): Promise<{ success: boolean; count: number }> {
        const auth = await this.getOAuth2Client();
        if (!auth) return { success: false, count: 0 };

        const client = (google as any).mybusinessbusinessinformation({ version: GBP_API_VERSION, auth });
        const accountClient = (google as any).mybusinessaccountmanagement({ version: 'v1', auth });

        try {
            const accountsRes = await accountClient.accounts.list();
            const accounts = accountsRes.data.accounts || [];
            let totalCount = 0;

            for (const account of accounts) {
                if (!account.name) continue;
                const locationsRes = await (client.accounts.locations as any).list({
                    parent: account.name,
                    readMask: 'name,title,storeCode'
                });
                const locations = locationsRes.data.locations || [];

                for (const location of locations) {
                    if (!location.name) continue;
                    const reviewsClient = (google as any).mybusinessreviews({ version: 'v1', auth });
                    const reviewsRes = await (reviewsClient.accounts.locations.reviews as any).list({
                        parent: location.name
                    });

                    const gbpReviews = reviewsRes.data.reviews || [];
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

                        if (location.storeCode) {
                            await setDoc(doc(db, 'properties', location.storeCode, 'reviews', reviewId), {
                                ...transformed,
                                updatedAt: serverTimestamp()
                            }, { merge: true });
                        }

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
            console.error('Sync failed:', error);
            throw error;
        }
    },

    async replyToReview(locationName: string, reviewId: string, replyText: string): Promise<void> {
        const auth = await this.getOAuth2Client();
        if (!auth) throw new Error('Unauthorized');
        const reviewsClient = (google as any).mybusinessreviews({ version: 'v1', auth });
        try {
            await (reviewsClient.accounts.locations.reviews as any).updateReply({
                name: `${locationName}/reviews/${reviewId}/reply`,
                requestBody: { comment: replyText }
            });
        } catch (error) {
            console.error('Reply failed:', error);
            throw error;
        }
    }
};
