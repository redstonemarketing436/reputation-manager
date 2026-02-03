"use client";

import { usePropertyFilter } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleBusinessService } from '@/lib/services/google-business';
import { Review } from '@/lib/types';
import { ReviewCard } from '../ReviewCard';
import { useState, useEffect } from 'react';

export function RecentReviews() {
    const { selectedPropertyId } = usePropertyFilter();
    const { user } = useAuth();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
                // Sort by date desc
                const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setReviews(sorted);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [selectedPropertyId, user]);

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-white tracking-tight">Recent Reviews</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="bg-redstone-card p-10 text-center animate-pulse border border-redstone-card/50">
                        Loading reviews...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-redstone-card p-10 text-center text-gray-500 border border-redstone-card/50">
                        No reviews found.
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onReplied={() => { }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
