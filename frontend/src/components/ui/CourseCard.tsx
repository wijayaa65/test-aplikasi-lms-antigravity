import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface Course {
    id: string;
    title: string;
    description?: string;
    instructor_id?: string;
    thumbnail_url?: string;
    price?: number;
    published?: boolean;
    rating?: number;
    students?: number;
    duration?: string;
    progress?: number;
}

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    const {
        id,
        title,
        thumbnail_url,
        price = 0,
        rating = 4.5,
        students = 0,
        duration = "2h 30m",
        progress,
    } = course;

    return (
        <Link href={`/courses/${id}`} className="group">
            <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={thumbnail_url || "/placeholder-course.jpg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                    />
                    {progress !== undefined && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-accent"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Instructor</p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{duration}</span>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        {progress !== undefined ? (
                            <span className="text-sm font-medium text-primary">
                                {progress}% Complete
                            </span>
                        ) : (
                            <span className="font-bold text-lg text-foreground">
                                {price === 0 ? "Free" : `$${price}`}
                            </span>
                        )}

                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Course
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
