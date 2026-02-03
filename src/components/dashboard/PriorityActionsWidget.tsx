"use client";

import { useEffect, useState, useMemo } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleBusinessService } from '@/lib/services/google-business';
import { Review } from '@/lib/types';
import { AlertTriangle, Wrench, Users, Sparkles, MessageSquare, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS = {
    'Maintenance': Wrench,
    'Staff': Users,
    'Cleanliness': Sparkles,
    'Amenities': Sparkles,
    'Other': MessageSquare
};

export function PriorityActionsWidget() {
    const { selectedPropertyId } = usePropertyFilter();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            // In a real app, we might have a specific endpoint for "insights"
            // For now, we fetch all reviews and filter client-side
            if (!user) return;

            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
                // Filter for actionable items only
                const actionable = data.filter(r => r.isActionable);
                setReviews(actionable);
            } catch (err) {
                console.error("Failed to load insights", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [selectedPropertyId, user]);

    const groupedInsights = useMemo(() => {
        const groups: Record<string, Review[]> = {};
        reviews.forEach(review => {
            const cat = review.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(review);
        });
        return groups;
    }, [reviews]);

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;

    if (reviews.length === 0) return null; // Don't show section if empty

    return (

        <div className="bg-redstone-card rounded-none shadow-sm border border-redstone-card/50 p-10 mb-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-redstone-red/10 text-redstone-red rounded-none">
                    <AlertTriangle className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">Priority Actions</h2>
                <span className="ml-auto text-xs font-medium bg-redstone-red text-white px-2 py-1 rounded-full">
                    {reviews.length} Items
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(groupedInsights).map(([category, items]) => {
                    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || MessageSquare;

                    return (
                        <div key={category} className="border border-gray-700/30 rounded-none overflow-hidden bg-redstone-bg/40">
                            <div className="bg-redstone-bg px-6 py-4 border-b border-gray-700/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-redstone-red" />
                                    <h3 className="font-bold text-white text-xs uppercase tracking-widest">{category}</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-none uppercase tracking-tighter">
                                    {items.length}
                                </span>
                            </div>
                            <div className="divide-y divide-gray-700/20">
                                {items.map(review => (
                                    <div key={review.id} className="p-6 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-bold text-gray-200 tracking-tight">{review.author}</p>
                                            <span className="text-[10px] text-gray-500 uppercase font-medium">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                                            {review.content}
                                        </p>
                                        <div className="flex items-center text-[10px] text-redstone-red font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Review <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
