"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PropertyContextType {
    selectedPropertyId: string;
    setSelectedPropertyId: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
    // Default to 'ALL' for now
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('ALL');

    return (
        <PropertyContext.Provider value={{ selectedPropertyId, setSelectedPropertyId }}>
            {children}
        </PropertyContext.Provider>
    );
}

export function usePropertyFilter() {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error('usePropertyFilter must be used within a PropertyProvider');
    }
    return context;
}
