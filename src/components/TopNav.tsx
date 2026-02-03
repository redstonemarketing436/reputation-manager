"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { Building2, ChevronDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export function TopNav() {
    const { user } = useAuth();
    const { selectedPropertyId, setSelectedPropertyId } = usePropertyFilter();

    const allowedProperties = useMemo(() => {
        if (!user) return [];
        if (user.role === 'ADMIN' || user.assignedProperties.includes('ALL')) {
            return MOCK_PROPERTIES;
        }
        return MOCK_PROPERTIES.filter(prop => user.assignedProperties.includes(prop.id));
    }, [user]);

    useEffect(() => {
        if (selectedPropertyId === 'ALL') {
            if (user && user.role !== 'ADMIN' && !user.assignedProperties.includes('ALL')) {
                if (allowedProperties.length > 0) {
                    setSelectedPropertyId(allowedProperties[0].id);
                }
            }
            return;
        }
        if (allowedProperties.length > 0 && !allowedProperties.find(p => p.id === selectedPropertyId)) {
            setSelectedPropertyId(allowedProperties[0].id);
        }
    }, [allowedProperties, selectedPropertyId, user, setSelectedPropertyId]);

    return (
        <header className="h-16 bg-redstone-bg flex flex-col shrink-0 relative z-30">
            <div className="flex-1 flex items-center justify-between px-10">
                <div className="flex items-center">
                    <span className="text-xl font-bold tracking-tighter text-white uppercase italic">Redstone</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="flex items-center gap-3 bg-redstone-card/30 border border-gray-800 px-4 py-2 hover:border-redstone-red transition-all cursor-pointer">
                            <Building2 className="w-4 h-4 text-redstone-red" />
                            <select
                                value={selectedPropertyId}
                                onChange={(e) => setSelectedPropertyId(e.target.value)}
                                className="bg-transparent border-none text-white text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer pr-6"
                            >
                                {(user?.role === 'ADMIN' || user?.assignedProperties.includes('ALL')) && (
                                    <option value="ALL" className="bg-redstone-card text-white">All Locations</option>
                                )}
                                {allowedProperties.map((prop) => (
                                    <option key={prop.id} value={prop.id} className="bg-redstone-card text-white">
                                        {prop.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 pointer-events-none" />
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-none border border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 bg-redstone-card/20 uppercase">
                        {user?.name?.split(' ').map(n => n[0]).join('') || '??'}
                    </div>
                </div>
            </div>
            {/* Architectural Red Divider */}
            <div className="h-[1px] w-full bg-redstone-red/50 shadow-[0_0_10px_rgba(186,0,24,0.3)]"></div>
        </header>
    );
}
