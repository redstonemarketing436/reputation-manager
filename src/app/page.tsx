"use client";

import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PriorityActionsWidget } from "@/components/dashboard/PriorityActionsWidget";
import { SurveyLinkWidget } from "@/components/dashboard/SurveyLinkWidget";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tighter uppercase italic leading-none mb-4">Portfolio Intelligence</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] italic opacity-70">Real-time reputation management & sentiment analysis</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {isAdmin && (
            <button className="h-14 px-8 text-[10px] font-bold text-gray-400 border border-gray-800 hover:border-redstone-red hover:text-white transition-all rounded-none uppercase tracking-[0.2em] flex items-center gap-3 group">
              <Plus className="w-4 h-4 text-redstone-red group-hover:scale-125 transition-transform" />
              Add Property
            </button>
          )}
          <button className="h-14 px-8 text-[10px] font-bold text-white bg-redstone-red hover:bg-red-700 transition-all rounded-none shadow-lg shadow-redstone-red/10 flex items-center gap-4 uppercase tracking-[0.2em] group">
            Export Intelligence
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bento-box Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16">
        {/* Statistics - High Impact */}
        <div className="xl:col-span-12">
          <StatsCards />
        </div>

        {/* Main Actionable Intelligence - Priority Actions */}
        <div className="xl:col-span-8 flex flex-col">
          <div className="bg-redstone-card border border-redstone-card/50 p-1 flex-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-redstone-red/30"></div>
            <PriorityActionsWidget />
          </div>
        </div>

        {/* Utility Widget - Survey Link */}
        <div className="xl:col-span-4 flex flex-col">
          <div className="bg-[#1a353b] border border-gray-800 p-1 flex-1 relative group">
            <div className="absolute top-0 right-0 w-[1px] h-full bg-redstone-red/20"></div>
            <SurveyLinkWidget />
          </div>
        </div>
      </div>

      {/* Content Feed */}
      <div className="relative pt-16 border-t border-gray-900">
        <div className="absolute -top-[1px] left-0 w-24 h-[1px] bg-redstone-red shadow-[0_0_10px_rgba(186,0,24,0.5)]"></div>
        <RecentReviews />
      </div>
    </div>
  );
}
