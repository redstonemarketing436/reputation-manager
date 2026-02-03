"use client";

import { useState, useMemo } from 'react';
import { MOCK_REVIEWS } from '@/lib/mock-data';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { Calendar, BarChart3, Mail, Download, PieChart, Activity } from 'lucide-react';

export default function ReportsPage() {
    const { selectedPropertyId } = usePropertyFilter();
    const [startDate, setStartDate] = useState(new Date('2023-01-01').toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportConfig, setReportConfig] = useState({ email: '', frequency: 'Weekly' });

    // Filter Reviews
    const filteredReviews = useMemo(() => {
        return MOCK_REVIEWS.filter((review) => {
            const reviewDate = new Date(review.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end day

            const matchesProperty = selectedPropertyId === 'ALL' || review.propertyId === selectedPropertyId;
            const matchesDate = reviewDate >= start && reviewDate <= end;
            return matchesProperty && matchesDate;
        });
    }, [selectedPropertyId, startDate, endDate]);

    // Calculate Metrics
    const totalSurveys = filteredReviews.length;
    const averageRating = totalSurveys > 0
        ? (filteredReviews.reduce((acc, rev) => acc + rev.rating, 0) / totalSurveys).toFixed(1)
        : 'N/A';

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = filteredReviews.filter(r => r.rating === star).length;
        return { star, count, percentage: totalSurveys > 0 ? (count / totalSurveys) * 100 : 0 };
    });

    // Simple Trend Data (Grouped by Month for simplicity in mock data)
    const trendData = useMemo(() => {
        const data: Record<string, { total: number; sum: number }> = {};
        filteredReviews.forEach(r => {
            const month = new Date(r.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!data[month]) data[month] = { total: 0, sum: 0 };
            data[month].total += 1;
            data[month].sum += r.rating;
        });
        return Object.entries(data).map(([month, stats]) => ({
            month,
            avg: (stats.sum / stats.total).toFixed(1)
        }));
    }, [filteredReviews]);


    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Scheduling Report:', reportConfig);
        alert(`Report Scheduled! Sent to ${reportConfig.email} every ${reportConfig.frequency}.`);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500">Track your property's reputation performance over time.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-gray-700 w-32 outline-none"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-gray-700 w-32 outline-none"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Schedule Report
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-500">Total Surveys</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalSurveys}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> +12% vs last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-500">Average Rating</h3>
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <PieChart className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                    <div className="flex gap-0.5 mt-2">
                        {[1, 2, 3, 4, 5].map(s => (
                            <div key={s} className={`h-1.5 w-full rounded-full ${s <= Number(averageRating) ? 'bg-yellow-400' : 'bg-gray-100'}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-500">Response Rate</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Download className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-500 mt-1">All reviews replied</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Rating Trend</h3>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {trendData.map((data, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-200 transition-colors relative"
                                    style={{ height: `${(Number(data.avg) / 5) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {data.avg}
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-gray-500">{data.month}</p>
                            </div>
                        ))}
                        {trendData.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No data for selected range
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Rating Distribution</h3>
                    <div className="space-y-4">
                        {ratingDistribution.map((item) => (
                            <div key={item.star} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600 w-3">{item.star}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-8 text-right">{Math.round(item.percentage)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule Report</h2>
                        <p className="text-gray-500 mb-6">Get automated summaries delivered to your inbox.</p>

                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Recipient</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="you@example.com"
                                    value={reportConfig.email}
                                    onChange={(e) => setReportConfig({ ...reportConfig, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={reportConfig.frequency}
                                    onChange={(e) => setReportConfig({ ...reportConfig, frequency: e.target.value })}
                                >
                                    <option value="Weekly">Weekly (Every Monday)</option>
                                    <option value="Monthly">Monthly (1st of month)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
