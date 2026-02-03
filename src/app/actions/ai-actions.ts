"use server";

import { AIService, ReviewAnalysis } from "@/lib/services/ai";

export async function generateReplyAction(reviewContent: string, authorName: string): Promise<string> {
    return AIService.generateReply(reviewContent, authorName);
}

export async function analyzeReviewAction(reviewContent: string): Promise<ReviewAnalysis> {
    return AIService.analyzeReview(reviewContent);
}
