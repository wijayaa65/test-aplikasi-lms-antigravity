import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to generate UUIDs if needed (or we fetch inserted IDs)
// We will insert courses, then use their IDs to insert sections, etc.

const MOCK_COURSES_DATA = [
    {
        title: 'Complete Web Development Bootcamp 2024',
        description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, build real projects and more!',
        price: 89.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop',
        published: true,
        sections: [
            {
                title: 'Introduction to Web Development',
                order_index: 0,
                lessons: [
                    { title: 'How the Internet Works', duration: 15, video_url: 'https://www.youtube.com/watch?v=sample1', order_index: 0, content: 'Basic concepts of HTTP, DNS, Hosting.' },
                    { title: 'Installing VS Code', duration: 10, video_url: 'https://www.youtube.com/watch?v=sample2', order_index: 1, content: 'Setting up your development environment.' }
                ]
            },
            {
                title: 'HTML 5 Basics',
                order_index: 1,
                lessons: [
                    { title: 'HTML Structure', duration: 25, video_url: 'https://www.youtube.com/watch?v=sample3', order_index: 0, content: 'Understanding the skeleton of a webpage.' },
                    { title: 'Forms and Inputs', duration: 30, video_url: 'https://www.youtube.com/watch?v=sample4', order_index: 1, content: 'Creating interactive forms.' }
                ]
            }
        ]
    },
    {
        title: 'Advanced React patterns & Performance',
        description: 'Level up your React skills. Master advanced functional patterns, performance optimization, and complex state management.',
        price: 49.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
        published: true,
        sections: [
            {
                title: 'Advanced Hooks',
                order_index: 0,
                lessons: [
                    { title: 'useMemo and useCallback', duration: 20, order_index: 0 },
                    { title: 'Custom Hooks', duration: 25, order_index: 1 }
                ]
            },
            {
                title: 'Performance Optimization',
                order_index: 1,
                lessons: [
                    { title: 'Code Splitting', duration: 15, order_index: 0 },
                    { title: 'React.memo', duration: 10, order_index: 1 }
                ]
            }
        ]
    },
    // Add more courses if needed, keeping it simple for now
];

export async function GET() {
    try {
        const results = [];

        for (const courseData of MOCK_COURSES_DATA) {
            // 1. Insert Course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .insert({
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    thumbnail_url: courseData.thumbnail_url,
                    published: courseData.published
                    // instructor_id: null (or fetch a user if desired)
                })
                .select()
                .single();

            if (courseError) throw new Error(`Course Error: ${courseError.message}`);

            results.push({ course: course.title, sections: [] });

            // 2. Insert Sections
            if (courseData.sections) {
                for (const sectionData of courseData.sections) {
                    const { data: section, error: sectionError } = await supabase
                        .from('course_sections')
                        .insert({
                            course_id: course.id,
                            title: sectionData.title,
                            order_index: sectionData.order_index
                        })
                        .select()
                        .single();

                    if (sectionError) throw new Error(`Section Error: ${sectionError.message}`);

                    // 3. Insert Lessons
                    if (sectionData.lessons) {
                        const lessonsPayload = sectionData.lessons.map(lesson => ({
                            section_id: section.id,
                            title: lesson.title,
                            duration: lesson.duration,
                            video_url: (lesson as any).video_url || null,
                            content: (lesson as any).content || null,
                            order_index: lesson.order_index
                        }));

                        const { error: lessonError } = await supabase
                            .from('course_lessons')
                            .insert(lessonsPayload);

                        if (lessonError) throw new Error(`Lesson Error: ${lessonError.message}`);
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Successfully seeded courses with sections and lessons',
            data: results
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
