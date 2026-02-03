"use client";

import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PriorityActionsWidget } from "@/components/dashboard/PriorityActionsWidget";
import { SurveyLinkWidget } from "@/components/dashboard/SurveyLinkWidget";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-white tracking-tight italic uppercase">Portfolio Dashboard</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button className="px-4 py-2 text-[10px] font-bold text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white transition-all rounded-none uppercase tracking-widest">
              Add Property
            </button>
          )}
          <button className="px-4 py-2 text-[10px] font-bold text-white bg-redstone-red hover:bg-red-700 transition-all rounded-none flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-red-900/10">
            Export Intelligence <span className="text-xs">›</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className="lg:col-span-2">
          <PriorityActionsWidget />
        </div>
        <div className="lg:col-span-1">
          <SurveyLinkWidget />
        </div>
      </div>

      <StatsCards />
      <RecentReviews />
    </div>
  );
}
