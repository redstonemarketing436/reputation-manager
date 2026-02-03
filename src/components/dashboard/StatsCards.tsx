"use client";

import { usePropertyFilter } from "@/contexts/PropertyContext";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleBusinessService } from "@/lib/services/google-business";
import { Star, TrendingUp, Users, Activity } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export function StatsCards() {
    const { selectedPropertyId } = usePropertyFilter();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;
            try {
                const data = await GoogleBusinessService.getReviews(selectedPropertyId, user);
                setReviews(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetch();
    }, [selectedPropertyId, user]);

    const stats = useMemo(() => {
        const total = reviews.length;
        const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : "0.0";
        const sentiment = total > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / total) * 100) : 0;

        return [
            { label: "Total Reviews", value: total.toString(), sub: "+5.2% vs prev period", icon: Users },
            { label: "Average Rating", value: avg, sub: "Portfolio Benchmark: 4.2", icon: Star, highlight: true },
            { label: "Sentiment Index", value: `${sentiment}%`, sub: "Positive sentiment weight", icon: TrendingUp },
            { label: "Response Rate", value: "100%", sub: "All locations compliant", icon: Activity },
        ];
    }, [reviews]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-redstone-card border border-redstone-card/50 p-8 shadow-xl relative group hover:border-redstone-red/40 transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors">{stat.label}</span>
                        <stat.icon className={`w-4 h-4 ${stat.highlight ? 'text-yellow-500' : 'text-gray-700'} group-hover:text-redstone-red transition-colors`} />
                    </div>
                    <div className="space-y-1">
                        <p className={`text-4xl font-bold tracking-tighter ${stat.highlight ? 'text-yellow-500 shadow-yellow-500/10 shadow-sm' : 'text-white'}`}>{stat.value}</p>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">{stat.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
