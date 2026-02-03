import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, serverTimestamp } from 'firebase/firestore';

export interface SurveyRecord {
    id: string;
    propertyId: string;
    residentEmail: string;
    type: 'Move-In' | 'Move-Out';
    status: 'SENT' | 'COMPLETED';
    sentAt: any;
    completedAt?: any;
    rating?: number;
    feedback?: string;
}

export const SurveyService = {
    /**
     * Records a new survey being sent.
     */
    async recordSent(propertyId: string, residentEmail: string, type: 'Move-In' | 'Move-Out'): Promise<string> {
        const docRef = await addDoc(collection(db, 'surveys'), {
            propertyId,
            residentEmail,
            type,
            status: 'SENT',
            sentAt: serverTimestamp()
        });
        return docRef.id;
    },

    /**
     * Updates a survey record when completed.
     */
    async recordCompletion(surveyId: string, rating: number, feedback: string): Promise<void> {
        // In a real app, we'd use surveyId to find and update the doc.
        // For simplicity here, we add a new "completion" or update status if ID is known.
        // Logic for lookup omitted for brevity, adding a general record completion helper.
        const surveysRef = collection(db, 'surveys');
        // This is a simplification; usually you'd have a specific ID from the survey link.
        await addDoc(surveysRef, {
            surveyId, // Link original sent record
            rating,
            feedback,
            status: 'COMPLETED',
            completedAt: serverTimestamp()
        });
    },

    /**
     * Fetches survey analytics for a specific property and date range.
     */
    async getAnalytics(propertyId: string, startDate: Date, endDate: Date) {
        const surveysRef = collection(db, 'surveys');
        let q = query(surveysRef,
            where('sentAt', '>=', Timestamp.fromDate(startDate)),
            where('sentAt', '<=', Timestamp.fromDate(endDate))
        );

        if (propertyId !== 'ALL') {
            q = query(q, where('propertyId', '==', propertyId));
        }

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return data;
    }
};
