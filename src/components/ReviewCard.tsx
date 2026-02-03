"use client";

import { useState } from 'react';
import { Review } from '@/lib/types';
import { GoogleBusinessService } from '@/lib/services/google-business';
import { ReviewAnalysis } from '@/lib/services/ai';
import { generateResponseAction, analyzeReviewAction } from '@/app/actions/ai-actions';
import { replyToReviewAction } from '@/app/actions/gbp-actions';
import { Star, MessageCircle, User, Wand2, Tag, AlertTriangle } from 'lucide-react';

interface ReviewCardProps {
    review: Review;
    onReplied: () => void;
}

export function ReviewCard({ review, onReplied }: ReviewCardProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);

    const handleDraftWithAI = async () => {
        setIsDrafting(true);
        try {
            const draft = await generateResponseAction(review.content, review.author);
            setReplyText(draft);
        } catch (error) {
            console.error("AI drafting failed", error);
        } finally {
            setIsDrafting(false);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeReviewAction(review.content);
            setAnalysis(result);
        } catch (error) {
            console.error("AI analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await replyToReviewAction(review.propertyId, review.id, replyText);
            setIsReplying(false);
            setReplyText('');
            onReplied();
        } catch (error) {
            console.error('Failed to reply', error);
            alert('Failed to post reply. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-redstone-card p-10 rounded-none border border-redstone-card/50 transition-all hover:border-redstone-red/30">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-redstone-bg flex items-center justify-center text-gray-500 border border-gray-700/30">
                        <User className="w-6 h-6 stroke-[1.5px]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg tracking-tight">{review.author}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] uppercase tracking-widest font-bold border
                            ${review.status === 'PENDING' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30' : ''}
                            ${review.status === 'Replied' ? 'bg-green-900/20 text-green-500 border-green-900/30' : ''}
                            ${review.status === 'Flagged' ? 'bg-red-900/20 text-red-500 border-red-900/30' : ''}
                        `}>
                            {review.status}
                        </span>

                        {/* Analysis Badge (Prioritize pre-analyzed data if available) */}
                        {(analysis || review.category) ? (
                            <div className={`flex items-center gap-2 px-2 py-0.5 rounded-none text-[10px] uppercase tracking-widest font-bold border
                                ${(analysis?.isActionable || review.isActionable) ? 'bg-red-900/20 text-red-500 border-red-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}
                            `}>
                                <Tag className="w-3 h-3" />
                                {analysis?.category || review.category}
                                {(analysis?.isActionable || review.isActionable) && <AlertTriangle className="w-3 h-3 ml-1" />}
                            </div>
                        ) : (
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 text-base">
                {review.content}
            </p>

            {review.status === 'Replied' ? (
                <div className="bg-green-900/10 border border-green-900/20 rounded-none p-6 flex items-start gap-4">
                    <div className="bg-green-900/20 p-2 rounded-none text-green-500">
                        <MessageCircle className="w-5 h-5 stroke-[1.5px]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-green-500 uppercase tracking-wider">Replied</p>
                        <p className="text-sm text-green-500/80 mt-1">Response posted to Google.</p>
                    </div>
                </div>
            ) : (
                <div>
                    {isReplying ? (
                        <div className="bg-redstone-bg p-6 rounded-none border border-redstone-card/50 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-4">
                                <label htmlFor={`reply-${review.id}`} className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Your Response
                                </label>
                                <button
                                    onClick={handleDraftWithAI}
                                    disabled={isDrafting}
                                    className="flex items-center gap-2 text-xs font-bold text-white bg-redstone-red hover:bg-red-700 px-4 py-2 rounded-none transition-colors uppercase tracking-wider"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    {isDrafting ? 'Drafting...' : 'Draft with AI'}
                                </button>
                            </div>
                            <textarea
                                id={`reply-${review.id}`}
                                rows={4}
                                className="w-full p-4 bg-redstone-card border border-gray-700 focus:border-redstone-red outline-none text-sm text-gray-200 mb-4 rounded-none transition-colors"
                                placeholder="Write a response to this review..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={isSubmitting || isDrafting}
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsReplying(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={!replyText.trim() || isSubmitting}
                                    className="px-6 py-2 text-xs font-bold text-white bg-redstone-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 uppercase tracking-wider"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsReplying(true)}
                            className="flex items-center gap-2 text-redstone-red hover:text-red-500 font-bold text-xs transition-colors uppercase tracking-widest"
                        >
                            <MessageCircle className="w-4 h-4 stroke-[2px]" />
                            Reply to Review
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
