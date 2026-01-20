"use client";

import { use, useState } from "react";
import Link from "next/link";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ChevronLeft, ChevronRight, Menu } from "lucide-react";

// Mock data
const LESSON = {
    id: "1",
    title: "Introduction to Next.js 14",
    videoUrl: "https://www.youtube.com/watch?v=__mSgDEOyv8", // Example: Next.js conf video
    description: "In this lesson, we will explore the fundamental concepts of Next.js 14 and how it changes the way we build web applications.",
    nextLessonId: "2",
    prevLessonId: null
};

const COURSE_CONTENT = [
    { id: "1", title: "Introduction to Next.js 14", duration: "10:00", completed: true },
    { id: "2", title: "Server Components Deep Dive", duration: "15:30", completed: false },
    { id: "3", title: "Database Schema Design", duration: "20:00", completed: false },
];

export default function LessonPage({
    params
}: {
    params: Promise<{ courseId: string }>
}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resolvedParams = use(params);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-muted/30 border-r border-border transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold truncate">Full-Stack dev...</h2>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    {COURSE_CONTENT.map((item, index) => (
                        <Link
                            key={item.id}
                            href="#"
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors ${item.id === LESSON.id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
                        >
                            {item.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className={`text-sm font-medium truncate ${item.id === LESSON.id ? 'text-primary' : ''}`}>
                                    {index + 1}. {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{item.duration}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <div className="h-16 border-b border-border flex items-center px-4 justify-between bg-background z-10">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}
                        <h1 className="font-bold text-lg hidden md:block">{LESSON.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={!LESSON.prevLessonId}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button size="sm" disabled={!LESSON.nextLessonId}>
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <VideoPlayer
                            url={LESSON.videoUrl}
                            title={LESSON.title}
                        />

                        <div className="mt-8">
                            <h1 className="text-2xl font-bold mb-4 md:hidden">{LESSON.title}</h1>
                            <p className="text-muted-foreground leading-relaxed">
                                {LESSON.description}
                            </p>

                            <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border">
                                <h3 className="font-bold mb-2">Lesson Resources</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>Running Next.js locally</li>
                                    <li>Source Code (GitHub)</li>
                                    <li>Reading: React Server Components</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
