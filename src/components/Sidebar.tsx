"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, PieChart, Settings, List, ChevronLeft, ChevronRight, LogOut, Layout } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: Layout, label: 'Dashboard', href: '/' },
        { icon: MessageSquare, label: 'Reviews', href: '/reviews' },
        { icon: PieChart, label: 'Reports', href: '/reports' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className={`transition-all duration-300 flex flex-col bg-redstone-bg border-r border-gray-800 h-screen relative z-40 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-10 pb-6 flex items-center justify-center h-16 shrink-0">
                {!isCollapsed ? (
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] italic opacity-50">Intelligence</span>
                ) : (
                    <div className="h-[1px] w-6 bg-redstone-red"></div>
                )}
            </div>

            <nav className="flex-1 mt-10">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group relative flex items-center px-8 py-5 transition-all
                                ${isActive ? 'text-white bg-redstone-red/5' : 'text-gray-500 hover:text-gray-200'}
                            `}
                        >
                            {/* Active Red Block */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-redstone-red shadow-[0_0_15px_rgba(186,0,24,0.5)]" />
                            )}

                            <item.icon className={`w-5 h-5 shrink-0 stroke-[1.2px] transition-colors ${isActive ? 'text-redstone-red' : 'group-hover:text-redstone-red'}`} />

                            {!isCollapsed && (
                                <span className="ml-5 text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-gray-900">
                {!isCollapsed && (
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-4 bg-redstone-card/10 border border-gray-900 p-4">
                            <div className="w-8 h-8 bg-redstone-red text-white flex items-center justify-center text-[10px] font-bold">
                                {user?.name?.split(' ').map(n => n[0]).join('') || '??'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">{user?.name}</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center p-6 text-gray-600 hover:text-white transition-colors border-t border-gray-900 group"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-redstone-red" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <ChevronLeft className="w-4 h-4 group-hover:text-redstone-red transition-colors" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Collapse Menu</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
