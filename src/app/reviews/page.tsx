
"use client";

import { useEffect, useState } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { getReviewsAction } from '@/app/actions/gbp-actions';
import { Review } from '@/lib/types';
import { ReviewCard } from '@/components/ReviewCard';
import { Loader2 } from 'lucide-react';

export default function ReviewsPage() {
    const { selectedPropertyId } = usePropertyFilter();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Renamed from 'loading' to 'isLoading'

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const data = await getReviewsAction(selectedPropertyId, user);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadReviews();
        }
    }, [selectedPropertyId, user]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Review Feed</h1>
                    <p className="text-gray-400 mt-2 text-sm italic">Manage and respond to customer reviews from Google Business Profile.</p>
                </div>
                <button
                    onClick={loadReviews}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-white px-4 py-2 transition-all uppercase tracking-widest"
                >
                    Refresh Feed
                </button>
            </div>

            <div className="space-y-8 pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-redstone-card/30 border border-redstone-card/50">
                        <Loader2 className="w-10 h-10 text-redstone-red animate-spin mb-6 stroke-[1.5px]" />
                        <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Synchronizing with Google...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-32 bg-redstone-card/30 border border-redstone-card/50">
                        <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">No reviews found for this property.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onReplied={loadReviews}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
