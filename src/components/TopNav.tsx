"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePropertyFilter } from '@/contexts/PropertyContext';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { Building2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

export function TopNav() {
    const { user } = useAuth();

    const allowedProperties = useMemo(() => {
        if (!user) return [];
        if (user.role === 'ADMIN' || user.assignedProperties.includes('ALL')) {
            return MOCK_PROPERTIES;
        }
        return MOCK_PROPERTIES.filter(prop => user.assignedProperties.includes(prop.id));
    }, [user]);

    // If selected property is not in allowed list, reset to ALL or first allowed
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
        <header className="h-24 bg-redstone-bg border-b border-redstone-red flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center gap-4">
                {/* Logo - moved here per design request */}
                <div className="relative w-32 h-8 mr-8">
                    <Image
                        src="/redstone-logo.svg"
                        alt="Redstone Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Property</span>
                </div>
                <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="bg-redstone-card border-none text-gray-200 text-sm focus:ring-1 focus:ring-redstone-red block p-2 min-w-[200px] outline-none"
                >
                    {(user?.role === 'ADMIN' || user?.assignedProperties.includes('ALL')) && (
                        <option value="ALL">All Locations</option>
                    )}
                    {allowedProperties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                            {prop.name}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
}
