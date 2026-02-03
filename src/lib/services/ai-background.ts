import { AIService } from './ai';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Review } from '../types';

export const AIBackgroundService = {
    /**
     * Sweeps Firestore for reviews that haven't been analyzed yet and processes them.
     */
    async processPendingReviews(): Promise<{ processed: number, errors: number }> {
        console.log('[AI Background] Starting audit of un-analyzed reviews...');

        try {
            const reviewsRef = collection(db, 'reviews');
            // Look for reviews where category is missing
            const q = query(reviewsRef, where('category', '==', null));
            const querySnapshot = await getDocs(q);

            let processed = 0;
            let errors = 0;

            const tasks = querySnapshot.docs.map(async (reviewDoc) => {
                const reviewData = reviewDoc.data() as Review;
                try {
                    console.log(`[AI Background] Analyzing review: ${reviewDoc.id}`);
                    const analysis = await AIService.analyzeReview(reviewData.content);

                    await updateDoc(doc(db, 'reviews', reviewDoc.id), {
                        category: analysis.category,
                        isActionable: analysis.isActionable,
                        aiSummary: analysis.summary,
                        sentiment: analysis.sentiment,
                        lastAnalyzedAt: new Date().toISOString()
                    });
                    processed++;
                } catch (err) {
                    console.error(`[AI Background] Failed to process ${reviewDoc.id}:`, err);
                    errors++;
                }
            });

            await Promise.all(tasks);
            console.log(`[AI Background] Audit complete. Processed: ${processed}, Errors: ${errors}`);
            return { processed, errors };
        } catch (error) {
            console.error('[AI Background] Fatal error during audit:', error);
            return { processed: 0, errors: 1 };
        }
    }
};
