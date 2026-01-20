"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Play, Check, Clock, User, FileText, Share2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// Mock data
const COURSE = {
    id: "1",
    title: "Advanced Full-Stack Web Development with Next.js",
    description: "Master modern web development by building real-world applications. This course covers everything from React Server Components to database optimization.",
    instructor: "Sarah Drasner",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    price: 0,
    duration: "12h 30m",
    students: 1234,
    rating: 4.8,
    lessons: [
        { id: "1", title: "Introduction to Next.js 14", duration: "10:00", type: "video" },
        { id: "2", title: "Server Components Deep Dive", duration: "15:30", type: "video" },
        { id: "3", title: "Database Schema Design", duration: "20:00", type: "video" },
        { id: "4", title: "Authentication Patterns", duration: "12:45", type: "video" }
    ]
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEnroll = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsEnrolled(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                                Most Popular Course
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {COURSE.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                {COURSE.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    {COURSE.instructor}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {COURSE.duration}
                                </div>
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {COURSE.lessons.length} Lessons
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isEnrolled ? (
                                    <Button
                                        size="lg"
                                        onClick={handleEnroll}
                                        disabled={isLoading}
                                        className="text-lg px-8 h-14"
                                    >
                                        {isLoading ? "Enrolling..." : "Enroll Now - Free"}
                                    </Button>
                                ) : (
                                    <Button size="lg" className="text-lg px-8 h-14 bg-green-600 hover:bg-green-700">
                                        <Check className="mr-2 h-5 w-5" /> Continue Learning
                                    </Button>
                                )}
                                <Button variant="outline" size="lg" className="h-14">
                                    <Share2 className="mr-2 h-5 w-5" /> Share
                                </Button>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <Image
                                src={COURSE.thumbnail}
                                alt={COURSE.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group cursor-pointer hover:bg-black/40 transition-colors">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>
                    <div className="space-y-4">
                        {COURSE.lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-medium group-hover:text-primary transition-colors">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{lesson.type}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground font-mono">
                                    {lesson.duration}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
