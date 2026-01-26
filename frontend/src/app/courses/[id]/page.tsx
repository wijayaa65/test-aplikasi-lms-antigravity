"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Check,
  Clock,
  User,
  FileText,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { courseAPI, Course } from "@/lib/api";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  // State to track expanded sections, default all open
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    loadCourse();
  }, [resolvedParams.id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getById(resolvedParams.id);
      setCourse(data);

      // Initialize all sections as expanded
      if (data.course_sections) {
        const initialExpanded: Record<string, boolean> = {};
        data.course_sections.forEach((section) => {
          initialExpanded[section.id] = true;
        });
        setExpandedSections(initialExpanded);
      }
    } catch (err: any) {
      console.error("Failed to load course:", err);
      setError(err.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    // Simulate API call or implement enrollmentAPI later
    setTimeout(() => {
      setIsEnrolled(true);
      setEnrolling(false);
    }, 1500);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-destructive text-xl mb-4">
          Error loading course
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadCourse}>Try Again</Button>
      </div>
    );
  }

  // Calculate total lessons
  const totalLessons =
    course.course_sections?.reduce(
      (acc, section) => acc + (section.course_lessons?.length || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                Most Popular Course
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {/* Instructor name not in schema yet, hardcoded or needs join */}
                  {/* {course.instructor_id || "Unknown Instructor"} */}
                  Expert Instructor
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {/* Calculate total duration from lessons */}
                  {Math.round(
                    course.course_sections?.reduce(
                      (acc, section) =>
                        acc +
                        (section.course_lessons?.reduce(
                          (lAcc, lesson) => lAcc + (lesson.duration || 0),
                          0,
                        ) || 0),
                      0,
                    ) || 0,
                  )}
                  m
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {totalLessons} Lessons
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isEnrolled ? (
                  <Button
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="text-lg px-8 h-14"
                  >
                    {enrolling
                      ? "Enrolling..."
                      : course.price === 0
                        ? "Enroll Now - Free"
                        : `Buy for $${course.price}`}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="text-lg px-8 h-14 bg-green-600 hover:bg-green-700"
                  >
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
                src={course.thumbnail_url || "/placeholder-course.jpg"}
                alt={course.title}
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

          <div className="space-y-6">
            {course.course_sections?.map((section) => (
              <div
                key={section.id}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-sm mr-4">
                      {section.course_lessons?.length || 0} lessons
                    </span>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedSections[section.id] && (
                  <div className="divide-y divide-border">
                    {section.course_lessons?.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="p-4 hover:bg-muted/20 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h4>
                            {/* <p className="text-xs text-muted-foreground">Video</p> */}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.duration}m
                        </div>
                      </div>
                    ))}
                    {(!section.course_lessons ||
                      section.course_lessons.length === 0) && (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No lessons in this section yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(!course.course_sections ||
              course.course_sections.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                No sections available for this course.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
