import { Review, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { MOCK_REVIEWS } from '@/lib/mock-data';

/**
 * Client-safe service for review data fetching.
 * This service now strictly queries the Firestore cache, 
 * which is synced server-side via GbpApiService.
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
            // Priority 1: Firestore Cache (Sync'd by Server)
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

                if (reviews.length > 0) return reviews;
            }

            // Priority 2: Mock Data Fallback
            console.log('[Mock Data] Using mock reviews as fallback (filtered by RBAC).');
            let reviews = MOCK_REVIEWS;
            if (propertyId === 'ALL') {
                if (!user.assignedProperties.includes('ALL')) {
                    reviews = reviews.filter(r => user.assignedProperties.includes(r.propertyId));
                }
            } else {
                reviews = reviews.filter(r => r.propertyId === propertyId);
            }
            return reviews;

        } catch (error) {
            console.error('Error in fetchAllReviews:', error);
            // Final safety fallback
            return MOCK_REVIEWS.filter(r => propertyId === 'ALL' || r.propertyId === propertyId);
        }
    },

    async getReviews(propertyId: string, user: User | null): Promise<Review[]> {
        return this.fetchAllReviews(propertyId, user);
    }
};
