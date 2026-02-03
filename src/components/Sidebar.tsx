"use client";

import Link from 'next/link';
import { Home, Star, Settings, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USERS } from '@/lib/mock-data';

export function Sidebar() {
    const { user, login } = useAuth();

    // Get initials
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??';

    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/' },
        { icon: Star, label: 'Reviews', href: '/reviews' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="h-screen w-80 bg-redstone-bg border-r border-redstone-card flex flex-col text-gray-400">
            {/* Logo Area - moved to TopNav typically in this design, but if sidebar stays left: */}
            {/* Design says "Top Navigation: Create a slim top bar with the 'Redstone' logo on the left" */}
            {/* So Sidebar might just be icons or secondary nav? 
               User says: "Sidebar Navigation: * Implement a dark sidebar with a red 'active state' block for the current page" 
               So we keep the sidebar. We'll remove the Header from Sidebar if it's in TopNav, 
               but "Redstone" logo is in TopNav. Let's make Sidebar purely nav. */}

            <div className="p-6">
                {/* Placeholder for spacing if logo is in top bar, or maybe just a menu icon */}
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            group flex items-center gap-4 px-8 py-5 transition-colors relative
                            ${item.href === '/' ? 'text-white bg-redstone-red' : 'hover:bg-redstone-card/10 hover:text-gray-200'}
                        `}
                    >
                        {/* Active State Red Block */}
                        {item.href === '/' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-redstone-red" />
                        )}

                        <item.icon className="w-5 h-5 stroke-[1.5px]" />
                        <span className="font-light tracking-wide text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-redstone-card/50">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 px-4 font-bold">Switch User (Test)</p>
                <div className="flex flex-col gap-2 px-4">
                    {MOCK_USERS.map((u) => (
                        <button
                            key={u.id}
                            onClick={() => login(u.id)}
                            className={`text-left text-xs p-2 transition-colors ${user?.id === u.id ? 'bg-redstone-red text-white' : 'hover:bg-redstone-card text-gray-400'}`}
                        >
                            {u.name} ({u.role})
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-redstone-card/50">
                {/* Collapsible Arrow (Mock) */}
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors w-full px-4">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Collapse</span>
                </button>
            </div>
        </div>
    );
}
