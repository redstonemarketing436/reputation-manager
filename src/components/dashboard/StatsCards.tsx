"use client";

import { usePropertyFilter } from '@/contexts/PropertyContext';
import { MOCK_REVIEWS } from '@/lib/mock-data';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export function StatsCards() {
    const { selectedPropertyId } = usePropertyFilter();

    const filteredReviews = useMemo(() => {
        if (selectedPropertyId === 'ALL') return MOCK_REVIEWS;
        return MOCK_REVIEWS.filter((r) => r.propertyId === selectedPropertyId);
    }, [selectedPropertyId]);

    const totalReviews = filteredReviews.length;
    const avgRating = totalReviews > 0
        ? (filteredReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const pendingReviews = filteredReviews.filter((r) => r.status === 'PENDING').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div className="bg-redstone-card p-10 text-redstone-text">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Total Reviews</p>
                        <h3 className="text-3xl font-light mt-2 text-white">{totalReviews}</h3>
                    </div>
                    <div className="text-gray-400">
                        <MessageSquare className="w-8 h-8 stroke-[1.5px]" />
                    </div>
                </div>
            </div>

            <div className="bg-redstone-card p-10 text-redstone-text">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Average Rating</p>
                        <h3 className="text-3xl font-light mt-2 text-white">{avgRating}</h3>
                    </div>
                    <div className="text-gray-400">
                        <Star className="w-8 h-8 stroke-[1.5px]" />
                    </div>
                </div>
            </div>

            <div className="bg-redstone-card p-10 text-redstone-text relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Pending Actions</p>
                        <h3 className="text-3xl font-light mt-2 text-white">{pendingReviews}</h3>
                    </div>
                    <div className="text-redstone-red">
                        <AlertCircle className="w-8 h-8 stroke-[1.5px]" />
                    </div>
                </div>
                {/* Subtle red accent for pending actions */}
                {pendingReviews > 0 && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-redstone-red/10 rounded-bl-full -mr-8 -mt-8" />
                )}
            </div>
        </div>
    );
}
