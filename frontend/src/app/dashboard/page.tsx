"use client";

import { useEffect, useState } from "react";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { enrollmentAPI, courseAPI } from "@/lib/api";
import CourseCard from "@/components/ui/CourseCard";
import Link from "next/link";
import { BookOpen, TrendingUp, Award, Plus } from "lucide-react";

function DashboardContent() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadEnrollments();
        }
    }, [user]);

    const loadEnrollments = async () => {
        try {
            const data = await enrollmentAPI.getMyEnrollments();
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to load enrollments:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen py-12">
            <div className="container px-4 mx-auto">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{user.name}</span>!
                    </h1>
                    <p className="text-muted-foreground">
                        {user.role === 'instructor'
                            ? "Manage your courses and track student progress."
                            : "Continue your learning journey."}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold">{enrollments.length}</span>
                        </div>
                        <h3 className="font-semibold mb-1">
                            {user.role === 'instructor' ? 'Total Courses' : 'Enrolled Courses'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {user.role === 'instructor' ? 'Courses you created' : 'Active enrollments'}
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-secondary" />
                            </div>
                            <span className="text-2xl font-bold">0%</span>
                        </div>
                        <h3 className="font-semibold mb-1">Average Progress</h3>
                        <p className="text-sm text-muted-foreground">Across all courses</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                                <Award className="h-6 w-6 text-accent" />
                            </div>
                            <span className="text-2xl font-bold">0</span>
                        </div>
                        <h3 className="font-semibold mb-1">Certificates</h3>
                        <p className="text-sm text-muted-foreground">Courses completed</p>
                    </div>
                </div>

                {/* Instructor Actions */}
                {user.role === 'instructor' && (
                    <div className="mb-8">
                        <Link
                            href="/instructor/courses/new"
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Course
                        </Link>
                    </div>
                )}

                {/* Courses Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            {user.role === 'instructor' ? 'Your Courses' : 'Continue Learning'}
                        </h2>
                        <Link
                            href="/courses"
                            className="text-primary hover:underline font-medium"
                        >
                            Browse All Courses
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                                    <div className="aspect-video bg-muted rounded-lg mb-4" />
                                    <div className="h-6 bg-muted rounded mb-2" />
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : enrollments.length === 0 ? (
                        <div className="text-center py-16 glass-card rounded-2xl">
                            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">
                                {user.role === 'instructor'
                                    ? 'No courses yet'
                                    : 'No enrollments yet'}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {user.role === 'instructor'
                                    ? 'Create your first course to get started.'
                                    : 'Enroll in a course to start learning.'}
                            </p>
                            <Link
                                href={user.role === 'instructor' ? '/instructor/courses/new' : '/courses'}
                                className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                            >
                                {user.role === 'instructor' ? 'Create Course' : 'Browse Courses'}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.map((enrollment) => (
                                <CourseCard key={enrollment.id} course={enrollment.course || enrollment} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
