"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
    const { setTheme, theme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        window.location.href = '/';
    };

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "border-b border-white/10 bg-background/80 backdrop-blur-md"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        Q
                    </div>
                    <span className="font-bold text-xl tracking-tight">Quantum Perigee</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/courses" className="hover:text-primary transition-colors">
                        Courses
                    </Link>
                    {isAuthenticated && (
                        <Link href="/dashboard" className="hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'instructor' && (
                        <Link href="/instructor/courses" className="hover:text-primary transition-colors">
                            My Courses
                        </Link>
                    )}
                    <Link href="/about" className="hover:text-primary transition-colors">
                        About
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{user.name}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg glass-card border border-white/10 shadow-lg py-2">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                        <p className="text-xs text-primary capitalize mt-1">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                        >
                            Get Started
                        </Link>
                    )}

                    <button className="md:hidden p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
