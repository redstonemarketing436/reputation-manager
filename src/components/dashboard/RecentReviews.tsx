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
            if (!user) return;
            setLoading(true);
            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
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
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] italic">Intelligence Feed</h2>
                <div className="h-[1px] flex-1 mx-8 bg-gray-900"></div>
                <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">View Archive ›</button>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {loading ? (
                    <div className="bg-redstone-card/10 p-20 text-center animate-pulse border border-gray-900 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-1 bg-gray-800"></div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Synchronizing Intelligence</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-redstone-card/10 p-20 text-center text-gray-600 border border-gray-900 uppercase tracking-widest text-[10px] font-bold">
                        No Intelligence Available for this Property
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="relative group">
                            <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-800 group-hover:bg-redstone-red transition-colors"></div>
                            <ReviewCard
                                review={review}
                                onReplied={() => { }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
