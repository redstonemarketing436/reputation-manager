import { Review, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

/**
 * Client-safe service for review data fetching.
 * This service strictly queries the Firestore cache.
 * All mock data fallbacks have been removed per strict cache requirements.
 */
export const GoogleBusinessService = {
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
            // Strict Requirement: Pull from 'reviews' Firestore collection (Local Cache)
            if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                const reviewsRef = collection(db, 'reviews');
                let q;

                if (propertyId === 'ALL') {
                    if (user.assignedProperties.includes('ALL')) {
                        q = query(reviewsRef, orderBy('date', 'desc'));
                    } else {
                        q = query(reviewsRef, where('propertyId', 'in', user.assignedProperties), orderBy('date', 'desc'));
                    }
                } else {
                    q = query(reviewsRef, where('propertyId', '==', propertyId), orderBy('date', 'desc'));
                }

                const querySnapshot = await getDocs(q);
                const reviews: Review[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    reviews.push({ id: doc.id, ...data } as Review);
                });

                return reviews;
            }

            // If Firebase is not configured, return empty
            return [];

        } catch (error) {
            console.error('Error in fetchAllReviews:', error);
            // Return empty array instead of mock fallback
            return [];
        }
    },

    async getReviews(propertyId: string, user: User | null): Promise<Review[]> {
        return this.fetchAllReviews(propertyId, user);
    }
};
