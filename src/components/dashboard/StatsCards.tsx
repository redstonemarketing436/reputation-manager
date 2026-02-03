"use client";

import { useAuth } from '@/contexts/AuthContext';
import { GoogleBusinessService } from '@/lib/services/google-business';
import { Review } from '@/lib/types';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StatsCards() {
    const { selectedPropertyId } = usePropertyFilter();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
                setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [selectedPropertyId, user]);

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const pendingReviews = reviews.filter((r) => r.status === 'PENDING').length;

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
