
"use client";

import { useEffect, useState } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleBusinessService } from '@/lib/services/google-business';
import { Review } from '@/lib/types';
import { ReviewCard } from '@/components/ReviewCard';
import { Loader2 } from 'lucide-react';

export default function ReviewsPage() {
    const { selectedPropertyId } = usePropertyFilter();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Renamed from 'loading' to 'isLoading'

    const loadReviews = async () => { // Renamed from 'fetchReviews' to 'loadReviews'
        setIsLoading(true);
        try {
            // Pass user context for authorization
            const data = await GoogleBusinessService.fetchAllReviews(selectedPropertyId, user); // Changed to fetchAllReviews
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error); // Updated error message
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadReviews(); // Changed to loadReviews
        }
    }, [selectedPropertyId, user]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Feed</h1>
                    <p className="text-gray-500 mt-1">Manage and respond to customer reviews from Google.</p>
                </div>
                <button
                    onClick={loadReviews} // Changed to loadReviews
                    className="text-sm text-blue-600 hover:underline"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500">Loading reviews...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                            <p className="text-gray-500">No reviews found for this property.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onReplied={fetchReviews}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
