"use client";

import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Shield, Mail, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAuthUrlAction } from '@/app/actions/gbp-auth';
import { useSearchParams } from 'next/navigation';

export default function SettingsPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const authSuccess = searchParams.get('auth_success');
    const authError = searchParams.get('auth_error');

    const handleConnectGoogle = async () => {
        try {
            await getAuthUrlAction();
        } catch (error) {
            console.error('Failed to initiate Google Auth:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic mb-2">Systems Configuration</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] italic opacity-70">Infrastructure & security management</p>
            </div>

            {/* Google Business Profile Integration */}
            <div className="bg-redstone-card border border-redstone-card/50 p-10 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-redstone-red group-hover:shadow-[0_0_15px_rgba(186,0,24,0.5)] transition-all"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold text-white tracking-tight italic uppercase">Google Business Intelligence</h2>
                            {authSuccess && (
                                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest border border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Connected
                                </div>
                            )}
                            {authError && (
                                <div className="flex items-center gap-2 text-redstone-red bg-redstone-red/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest border border-redstone-red/20">
                                    <AlertCircle className="w-3 h-3" />
                                    Auth Failed
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-light max-w-2xl">
                            Grant permission to synchronize reviews across all portfolio locations. This enables real-time sentiment analysis and centralized response management.
                        </p>
                    </div>

                    <button
                        onClick={handleConnectGoogle}
                        className="h-14 px-8 text-[10px] font-bold text-white bg-redstone-red hover:bg-red-700 transition-all rounded-none shadow-lg shadow-redstone-red/10 flex items-center gap-4 uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                        Connect Google Profile
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-redstone-card border border-gray-800 p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-redstone-red">
                            <User className="w-5 h-5 stroke-[1.5px]" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">User Profile</h2>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Identity</label>
                            <div className="bg-redstone-bg/40 border border-gray-900 p-4 text-[11px] font-mono text-gray-400">
                                {user?.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Security Clearances</label>
                            <div className="bg-redstone-bg/40 border border-gray-900 p-4 flex items-center gap-3">
                                <Shield className="w-4 h-4 text-redstone-red" />
                                <span className="text-[11px] font-mono text-white uppercase">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-redstone-card border border-gray-800 p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-redstone-red">
                            <Bell className="w-5 h-5 stroke-[1.5px]" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">Communications</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Intelligence Summaries', desc: 'Daily portfolio performance reports' },
                            { label: 'Critical Incident Alerts', desc: 'Immediate notification of negative feedback' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-redstone-bg/20 border border-gray-900 group hover:border-gray-700 transition-colors">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-200 uppercase tracking-tighter">{item.label}</p>
                                    <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1 italic">{item.desc}</p>
                                </div>
                                <div className="w-10 h-6 bg-gray-900 border border-gray-800 p-1 relative cursor-pointer">
                                    <div className="w-4 h-full bg-redstone-red"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
