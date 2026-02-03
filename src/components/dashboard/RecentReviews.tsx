"use client";

import { usePropertyFilter } from '@/contexts/PropertyContext';
import { MOCK_REVIEWS, MOCK_PROPERTIES } from '@/lib/mock-data';
import { ReviewCard } from '../ReviewCard';
import { useMemo } from 'react';

export function RecentReviews() {
    const { selectedPropertyId } = usePropertyFilter();

    const filteredReviews = useMemo(() => {
        let reviews = MOCK_REVIEWS;
        if (selectedPropertyId !== 'ALL') {
            reviews = reviews.filter((r) => r.propertyId === selectedPropertyId);
        }
        // Sort by date desc
        return [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedPropertyId]);

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-white tracking-tight">Recent Reviews</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {filteredReviews.length === 0 ? (
                    <div className="bg-redstone-card p-10 text-center text-gray-500 border border-redstone-card/50">
                        No reviews found.
                    </div>
                ) : (
                    filteredReviews.map((review) => (
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
