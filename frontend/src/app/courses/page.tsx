"use client";

import { useState, useEffect } from "react";
import { courseAPI } from "@/lib/api";
import CourseCard from "@/components/ui/CourseCard";
import { Search, Filter } from "lucide-react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseAPI.getAll();
            setCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-muted/30">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
                <div className="container px-4 relative z-10 mx-auto">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Explore Our <span className="text-gradient">Courses</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8">
                            Discover world-class courses taught by industry experts. Start learning today.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 rounded-xl glass border border-white/10 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-16">
                <div className="container px-4 mx-auto">
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                                    <div className="aspect-video bg-muted rounded-lg mb-4" />
                                    <div className="h-6 bg-muted rounded mb-2" />
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                {searchQuery ? "No courses found matching your search." : "No courses available yet."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">
                                    {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
