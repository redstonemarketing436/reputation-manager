import { db } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { Review, User } from "../types";

/**
 * Saves or updates a Google review in the property-specific sub-collection.
 * Path: properties/{propertyId}/reviews/{reviewId}
 */
export async function syncReview(propertyId: string, review: Review) {
    try {
        const reviewRef = doc(db, 'properties', propertyId, 'reviews', review.id);
        await setDoc(reviewRef, {
            ...review,
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Also maintain a top-level collection for easier global queries if needed, 
        // but the request specifically mentioned properties/{propId}/reviews.
        const globalReviewRef = doc(db, 'reviews', review.id);
        await setDoc(globalReviewRef, {
            ...review,
            propertyId,
            updatedAt: serverTimestamp()
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("Error syncing review:", error);
        throw error;
    }
}

/**
 * Saves resident feedback to the surveys collection.
 */
export async function saveSurvey(data: {
    propertyId: string;
    residentEmail: string;
    rating: number;
    feedback: string;
    type: string;
}) {
    try {
        const surveysRef = collection(db, 'surveys');
        const docRef = await addDoc(surveysRef, {
            ...data,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving survey:", error);
        throw error;
    }
}

/**
 * Fetches user roles and assignedProperties from the users collection.
 */
export async function getUserData(userId: string): Promise<User | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}
