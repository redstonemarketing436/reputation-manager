"use client";

import { useState, useEffect, useMemo } from 'react';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { getSurveyAnalyticsAction, scheduleReportAction } from '@/app/actions/reports-actions';
import { Calendar, BarChart3, Mail, TrendingUp, PieChart, Activity, Clock, ChevronRight, Share2, Star } from 'lucide-react';

export default function ReportsPage() {
    const { selectedPropertyId } = usePropertyFilter();

    // Default to last 30 days
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 30);

    const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [surveyData, setSurveyData] = useState<any[]>([]);
    const [reportConfig, setReportConfig] = useState({ email: '', frequency: 'Weekly' });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getSurveyAnalyticsAction(selectedPropertyId, startDate, endDate);
            setSurveyData(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedPropertyId, startDate, endDate]);

    // Calculate Metrics
    const metrics = useMemo(() => {
        const completed = surveyData.filter(s => s.status === 'COMPLETED');
        const total = surveyData.length;
        const avg = completed.length > 0
            ? (completed.reduce((acc, s) => acc + (s.rating || 0), 0) / completed.length).toFixed(1)
            : '0.0';

        const responseRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

        return { total, avg, responseRate, completedCount: completed.length };
    }, [surveyData]);

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsScheduling(true);
        try {
            await scheduleReportAction(reportConfig.email, reportConfig.frequency, selectedPropertyId);
            alert(`Report Scheduled! You will receive a summary at ${reportConfig.email} ${reportConfig.frequency.toLowerCase()}.`);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to schedule report:", error);
            alert("Failed to schedule report. Please try again.");
        } finally {
            setIsScheduling(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">

            {/* Redstone Header Section */}
            <div className="bg-redstone-card p-10 rounded-none border border-redstone-card/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="absolute top-0 left-0 w-1 h-full bg-redstone-red"></div>
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tighter uppercase mb-2">INTELLIGENCE & INSIGHTS</h1>
                    <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold italic">Real-time reputation performance across your portfolio</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-redstone-bg border border-gray-800 p-2">
                        <Calendar className="w-4 h-4 text-redstone-red ml-2" />
                        <div className="flex items-center text-xs font-mono text-gray-400">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-white w-28 uppercase"
                            />
                            <span className="mx-2 opacity-30">—</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-white w-28 uppercase"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-redstone-red text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-redstone-red/10"
                    >
                        <Mail className="w-3.5 h-3.5" />
                        Schedule Report
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Surveys Issued"
                    value={metrics.total.toString()}
                    icon={<TrendingUp className="w-4 h-4" />}
                    sub="Move-In & Move-Out tracking"
                />
                <KpiCard
                    label="Response Rate"
                    value={`${metrics.responseRate}%`}
                    icon={<Activity className="w-4 h-4" />}
                    sub={`${metrics.completedCount} completions total`}
                />
                <KpiCard
                    label="Average Rating"
                    value={metrics.avg}
                    icon={<Star className="w-4 h-4" />}
                    sub="Aggregated resident sentiment"
                    isGold
                />
                <KpiCard
                    label="Performance Index"
                    value="94.2"
                    icon={<Activity className="w-4 h-4" />}
                    sub="Proprietary Redstone metric"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart Placeholder - Luxury Version */}
                <div className="lg:col-span-2 bg-redstone-card p-8 border border-redstone-card/50 shadow-xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">SENTIMENT TRENDS</h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-redstone-red"></div> RATING</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-800"></div> TARGET</div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex flex-col items-center gap-4 w-full group">
                                <div className="w-full h-full bg-gray-900/50 relative flex items-end">
                                    <div className="absolute top-1/4 w-full border-t border-gray-800 border-dashed z-0"></div>
                                    <div
                                        className="w-full bg-redstone-red/20 border-t border-redstone-red transition-all duration-700 hover:bg-redstone-red/40 cursor-help relative z-10"
                                        style={{ height: `${40 + Math.random() * 50}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[10px] py-1 px-2 font-mono opacity-0 group-hover:opacity-100 transition-opacity border border-gray-800">
                                            {(3 + Math.random() * 2).toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">WK 0{i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-redstone-card p-8 border border-redstone-card/50 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-10 text-center">RATING DISTRIBUTION</h3>
                    <div className="space-y-6">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = surveyData.filter(s => s.rating === star).length;
                            const pct = metrics.completedCount > 0 ? (count / metrics.completedCount) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-4 group">
                                    <span className="text-[10px] font-bold text-gray-500 w-4 font-mono group-hover:text-white transition-colors">{star}★</span>
                                    <div className="flex-1 h-[2px] bg-gray-900 overflow-hidden">
                                        <div
                                            className="h-full bg-redstone-red transition-all duration-1000 shadow-[0_0_10px_rgba(186,0,36,0.3)]"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-700 w-8 text-right group-hover:text-redstone-red transition-colors">{Math.round(pct)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-redstone-bg/90 flex items-center justify-center p-6 z-50 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-redstone-card rounded-none border border-redstone-card/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg w-full p-12 relative animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-redstone-red"></div>
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter uppercase">SCHEDULE EXECUTIVE SUMMARY</h2>
                        <p className="text-gray-400 mb-10 text-xs font-bold uppercase tracking-widest italic opacity-70">Automated PDF delivery of performance metrics</p>

                        <form onSubmit={handleScheduleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Recipient Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-redstone-bg border border-gray-800 p-4 text-white focus:border-redstone-red outline-none transition-colors text-sm"
                                    placeholder="EXECUTIVE@REDSTONEMARKETING.COM"
                                    value={reportConfig.email}
                                    onChange={(e) => setReportConfig({ ...reportConfig, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Reporting Cadence</label>
                                <select
                                    className="w-full bg-redstone-bg border border-gray-800 p-4 text-white focus:border-redstone-red outline-none transition-colors text-sm uppercase tracking-widest"
                                    value={reportConfig.frequency}
                                    onChange={(e) => setReportConfig({ ...reportConfig, frequency: e.target.value })}
                                >
                                    <option value="Weekly">Weekly (Every Monday)</option>
                                    <option value="Monthly">Monthly (1st of month)</option>
                                    <option value="Quarterly">Quarterly (Consolidated)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isScheduling}
                                    className="flex-1 py-4 bg-redstone-red text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-30"
                                >
                                    {isScheduling ? 'PROVISIONING...' : 'CONFIRM SCHEDULE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function KpiCard({ label, value, icon, sub, isGold }: { label: string, value: string, icon: React.ReactNode, sub: string, isGold?: boolean }) {
    return (
        <div className="bg-redstone-card p-6 border border-redstone-card/50 shadow-xl group hover:border-redstone-red/30 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{label}</span>
                <div className={`p-2 bg-redstone-bg border border-gray-900 text-gray-600 group-hover:text-redstone-red group-hover:border-redstone-red/20 transition-all ${isGold ? 'text-yellow-500' : ''}`}>
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className={`text-4xl font-bold tracking-tighter ${isGold ? 'text-yellow-500' : 'text-white'}`}>{value}</p>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider italic">{sub}</p>
            </div>
        </div>
    );
}
