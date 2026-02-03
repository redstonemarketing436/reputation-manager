"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ReviewAnalysis {
    category: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    isActionable: boolean;
    summary: string;
}

/**
 * Generates a professional reply using Gemini Pro.
 * Runs on the server to protect GEMINI_API_KEY.
 */
export async function generateReplyAction(reviewContent: string, authorName: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Write a professional, empathetic, and concise response to a property review from a resident named "${authorName}". 
      
      Review Content: "${reviewContent}"
      
      The response should address specific points, thank them, and if the review is negative, offer a way to resolve the issue. Keep it under 50 words.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error in generateReplyAction:", error);
        throw new Error("Failed to generate AI reply");
    }
}

/**
 * Analyzes a review for sentiment and actionability using Gemini Pro.
 * Runs on the server to protect GEMINI_API_KEY.
 */
export async function analyzeReviewAction(reviewContent: string): Promise<ReviewAnalysis> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Analyze this property review. Return ONLY a valid JSON object.
            
            Fields:
            - category: Exactly one of "Maintenance", "Noise", "Staff", "Cleanliness", "Amenities", or "General".
            - sentiment: Exactly one of "Positive", "Neutral", or "Negative".
            - isActionable: boolean (true if specific issues are reported).
            - summary: 3-5 word summary.

            Review: "${reviewContent}"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Robust JSON cleaning
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;

        return JSON.parse(jsonStr) as ReviewAnalysis;
    } catch (error) {
        console.error("Error in analyzeReviewAction:", error);
        throw new Error("Failed to analyze review");
    }
}
