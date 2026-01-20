"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setToken, removeToken, getToken, User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const initAuth = async () => {
            console.time('AuthInit');
            const token = getToken();
            if (token) {
                try {
                    const currentUser = await authAPI.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Failed to get current user:', error);
                    removeToken();
                }
            }
            setLoading(false);
            console.timeEnd('AuthInit');
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password);
            setToken(response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string, role: string) => {
        try {
            const response = await authAPI.register(email, password, fullName, role);
            setToken(response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Protected route wrapper component
export function ProtectedRoute({
    children,
    allowedRoles
}: {
    children: React.ReactNode;
    allowedRoles?: string[]
}) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/auth/login';
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }


    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
