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
            if (!user) return;
            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
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

    if (loading) return <div className="animate-pulse h-96 bg-redstone-card/10 border border-gray-900"></div>;

    if (reviews.length === 0) return (
        <div className="bg-redstone-card border border-redstone-card/50 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Sparkles className="w-8 h-8 text-gray-800 mb-6 stroke-[1px]" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">No Critical Actions Identified</p>
        </div>
    );

    return (
        <div className="bg-redstone-card border border-redstone-card/50 p-10 h-full">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-12 bg-redstone-red/10 border border-redstone-red/20 text-redstone-red flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight italic uppercase">Priority Intelligence</h2>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">High-impact issues requiring immediate address</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] font-mono text-redstone-red font-bold">{reviews.length}</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none">Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(groupedInsights).map(([category, items]) => {
                    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || MessageSquare;

                    return (
                        <div key={category} className="border border-gray-900 bg-redstone-bg/40 flex flex-col">
                            <div className="bg-redstone-bg px-6 py-4 border-b border-gray-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-redstone-red stroke-[1.5px]" />
                                    <h3 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">{category}</h3>
                                </div>
                                <span className="text-[9px] font-mono text-gray-400">0{items.length}</span>
                            </div>
                            <div className="divide-y divide-gray-900 flex-1">
                                {items.slice(0, 2).map(review => (
                                    <div key={review.id} className="p-6 hover:bg-white/5 transition-all group cursor-pointer relative">
                                        <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-4 h-4 text-redstone-red" />
                                        </div>
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-[10px] font-bold text-white tracking-widest uppercase">{review.author}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light font-sans group-hover:text-gray-300 transition-colors">
                                            {review.content}
                                        </p>
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
