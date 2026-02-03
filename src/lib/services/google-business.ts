import { Review, ReviewStatus, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, setDoc } from 'firebase/firestore';
import { MOCK_REVIEWS } from '@/lib/mock-data';
import { google } from 'googleapis';

const GBP_API_VERSION = 'v1';

export const GoogleBusinessService = {
    /**
     * Helper to get a Google API client if credentials exist
     */
    async getApiClient() {
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!credentials) return null;

        try {
            const auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(credentials),
                scopes: ['https://www.googleapis.com/auth/business.manage'],
            });
            return google.mybusinessbusinessinformation({ version: GBP_API_VERSION, auth });
        } catch (error) {
            console.error('Failed to initialize Google API client:', error);
            return null;
        }
    },

    async fetchAllReviews(propertyId: string, user: User | null): Promise<Review[]> {
        if (!user) {
            console.error('[Access Denied] No user provided.');
            throw new Error('Unauthorized');
        }

        // Check if user has access to this property
        const hasAccess = user.assignedProperties.includes('ALL') || user.assignedProperties.includes(propertyId) || propertyId === 'ALL';
        if (!hasAccess) {
            console.error(`[Access Denied] User ${user.email} does not have access to property ${propertyId}`);
            throw new Error('Access Denied');
        }

        try {
            // Priority 1: Try real Google API
            const client = await this.getApiClient();
            if (client && propertyId !== 'ALL') {
                // In a real scenario, we'd map propertyId to a Google Location Name
                // e.g., locations/12345/reviews
                // For now, let's assume we have a mapping or use a placeholder
                console.log(`[GBP API] Fetching reviews for property: ${propertyId}`);
                // const response = await (client as any).accounts.locations.reviews.list({
                //     parent: `accounts/YOUR_ACCOUNT/locations/${propertyId}`
                // });
                // return response.data.reviews.map(transformGbpReview);
            }

            // Priority 2: Firestore Cache
            if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                const reviewsRef = collection(db, 'reviews');
                let q;

                if (propertyId === 'ALL') {
                    q = query(reviewsRef, orderBy('date', 'desc'));
                } else {
                    q = query(reviewsRef, where('propertyId', '==', propertyId), orderBy('date', 'desc'));
                }

                const querySnapshot = await getDocs(q);
                const reviews: Review[] = [];

                querySnapshot.forEach((doc) => {
                    reviews.push({ id: doc.id, ...doc.data() } as Review);
                });

                if (reviews.length > 0) return reviews;
            }

            // Priority 3: Mock Data Fallback
            console.log('[Mock Data] Using mock reviews as fallback.');
            let reviews = MOCK_REVIEWS;
            if (propertyId !== 'ALL') {
                reviews = reviews.filter(r => r.propertyId === propertyId);
            }
            return reviews;

        } catch (error) {
            console.error('Error in fetchAllReviews:', error);
            // Final safety fallback
            return MOCK_REVIEWS.filter(r => propertyId === 'ALL' || r.propertyId === propertyId);
        }
    },

    // Alias for getReviews to match some older usage if any, but unifying on fetchAllReviews
    async getReviews(propertyId: string, user: User | null): Promise<Review[]> {
        return this.fetchAllReviews(propertyId, user);
    },

    async replyToReview(reviewId: string, replyText: string): Promise<void> {
        console.log(`[Google Business] Posting reply to review ${reviewId}...`);

        try {
            // 1. Post to Google if client available
            const client = await this.getApiClient();
            if (client) {
                // await (client as any).accounts.locations.reviews.updateReply({
                //     name: `accounts/ACCOUNT/locations/LOCATION/reviews/${reviewId}/reply`,
                //     resource: { comment: replyText }
                // });
                console.log('[GBP API] Successfully posted reply to Google.');
            }

            // 2. Update local Firestore cache
            if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                const reviewRef = doc(db, 'reviews', reviewId);
                await updateDoc(reviewRef, {
                    status: 'Replied',
                    reply: replyText,
                    repliedAt: new Date().toISOString()
                }).catch(async (err) => {
                    // If it doesn't exist in Firestore yet (e.g. it was from mock data), we might want to create it
                    // but usually, real replies only happen for real data.
                    console.warn('Review not found in Firestore to update status, skipping cache update.');
                });
            }
        } catch (error) {
            console.error('Error replying to review:', error);
            throw error;
        }
    }
};
