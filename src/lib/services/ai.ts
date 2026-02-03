import { GoogleGenerativeAI } from '@google/generative-ai';

// Users must add GEMINI_API_KEY to their .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ReviewAnalysis {
    category: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    isActionable: boolean;
    summary: string;
}

export const AIService = {
    async generateReply(reviewContent: string, authorName: string): Promise<string> {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is missing');
            return "Thank you for your feedback! (AI generation unavailable - missing API key)";
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `Write a professional, empathetic, and concise response to a property review from a resident named "${authorName}". 
      
      Review Content: "${reviewContent}"
      
      The response should address specific points, thank them, and if the review is negative, offer a way to resolve the issue. Keep it under 50 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating reply:', error);
            return "Thank you for your feedback! We appreciate you taking the time to share your thoughts.";
        }
    },

    async analyzeReview(reviewContent: string): Promise<ReviewAnalysis> {
        if (!process.env.GEMINI_API_KEY) {
            return {
                category: 'Uncategorized',
                sentiment: 'Neutral',
                isActionable: false,
                summary: 'AI Analysis Unavailable'
            };
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `Analyze this property review. Return ONLY a valid JSON object.
            
            Fields:
            - category: Exactly one of "Maintenance", "Noise", "Staff", "Cleanliness", "Amenities", or "General".
            - sentiment: Exactly one of "Positive", "Neutral", or "Negative".
            - isActionable: boolean (true if specific issues are reported).
            - summary: 3-5 word summary.

            Review: "${reviewContent}"`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;

            return JSON.parse(jsonStr) as ReviewAnalysis;
        } catch (error) {
            console.error('Error analyzing review:', error);
            return {
                category: 'Error',
                sentiment: 'Neutral',
                isActionable: false,
                summary: 'Analysis Failed'
            };
        }
    }
};
