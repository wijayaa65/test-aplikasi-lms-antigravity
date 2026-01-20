export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: Date;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    thumbnailUrl?: string;
    price: number;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Invite {
    id: string;
    courseId: string;
    email: string;
    token: string;
    status: 'pending' | 'accepted' | 'expired';
    invitedBy: string;
    createdAt: Date;
    expiresAt: Date;
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    position: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Progress {
    id: string;
    userId: string;
    courseId: string;
    lessonId: string;
    completed: boolean;
    watchTime: number;
    lastPosition: number;
    completedAt?: Date;
    lastAccessed: Date;
}
