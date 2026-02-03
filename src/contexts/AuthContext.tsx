"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Default to Admin
    const [user, setUser] = useState<User | null>(MOCK_USERS[0]);

    const login = (userId: string) => {
        const foundUser = MOCK_USERS.find((u) => u.id === userId);
        if (foundUser) {
            setUser(foundUser);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
