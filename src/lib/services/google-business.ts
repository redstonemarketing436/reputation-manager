import { Review, ReviewStatus, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';

export const GoogleBusinessService = {
    async fetchAllReviews(propertyId: string, user: User | null): Promise<Review[]> {
        if (!user) {
            console.error('[Access Denied] No user provided.');
            throw new Error('Unauthorized');
        }

        // Check if user has access to this property
        const hasAccess = user.assignedProperties.includes('ALL') || user.assignedProperties.includes(propertyId);
        if (!hasAccess) {
            console.error(`[Access Denied] User ${user.email} does not have access to property ${propertyId}`);
            throw new Error('Access Denied');
        }

        try {
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

            if (reviews.length === 0) {
                console.log('No reviews found in Firestore reviews collection.');
            }

            return reviews;
        } catch (error) {
            console.error('Error fetching reviews from Firestore:', error);
            // Return empty array to trigger the "No reviews found" message in UI
            return [];
        }
    },

    async replyToReview(reviewId: string, replyText: string): Promise<void> {
        console.log(`[Firestore Cache] Updating review ${reviewId} status to Replied...`);
        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, {
                status: 'Replied'
            });
        } catch (error) {
            console.error('Error updating review status in Firestore:', error);
            throw error;
        }
    }
};
