import { generateReplyAction, analyzeReviewAction, ReviewAnalysis } from "@/app/actions/ai-actions";

export type { ReviewAnalysis };

export const AIService = {
    /**
     * Generates a reply by calling the secure Server Action.
     */
    async generateReply(reviewContent: string, authorName: string): Promise<string> {
        try {
            return await generateReplyAction(reviewContent, authorName);
        } catch (error) {
            console.error('Error in AIService.generateReply:', error);
            return "Thank you for your feedback! We appreciate you taking the time to share your insights.";
        }
    },

    /**
     * Analyzes a review by calling the secure Server Action.
     */
    async analyzeReview(reviewContent: string): Promise<ReviewAnalysis> {
        try {
            return await analyzeReviewAction(reviewContent);
        } catch (error) {
            console.error('Error in AIService.analyzeReview:', error);
            return {
                category: 'Uncategorized',
                sentiment: 'Neutral',
                isActionable: false,
                summary: 'Analysis Failed'
            };
        }
    }
};
