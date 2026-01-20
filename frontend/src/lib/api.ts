
import { supabase } from './supabase';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    avatar?: string;
}

export interface AuthResponse {
    message: string;
    user: User | null;
    token: string | null;
}

// Auth API functions
export const authAPI = {
    async register(email: string, password: string, fullName: string, role: string): Promise<AuthResponse> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) throw new Error(error.message);

        // Ideally, we'd return the user object here, but mapping Supabase user 
        // to our User interface requires careful handling of metadata
        const user: User | null = data.user ? {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.full_name,
            role: data.user.user_metadata.role,
        } : null;

        return {
            message: 'Registration successful',
            user,
            token: data.session?.access_token || null
        };
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);

        const user: User | null = data.user ? {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.full_name,
            role: data.user.user_metadata.role,
        } : null;

        return {
            message: 'Login successful',
            user,
            token: data.session?.access_token || null
        };
    },

    async getCurrentUser(): Promise<User> {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) throw new Error('Failed to get current user');

        return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.full_name || '',
            role: user.user_metadata.role || 'student', // Fallback
            avatar: user.user_metadata.avatar_url
        };
    },

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },
};

// Course API functions
export const courseAPI = {
    async getAll(): Promise<any[]> {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<any> {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async create(data: any): Promise<any> {
        const { data: newCourse, error } = await supabase
            .from('courses')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newCourse;
    },

    async update(id: string, data: any): Promise<any> {
        const { data: updatedCourse, error } = await supabase
            .from('courses')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updatedCourse;
    },
};

// Lesson API functions
export const lessonAPI = {
    async getByCourse(courseId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('courseId', courseId)
            .order('order', { ascending: true }); // Assuming there is an 'order' column

        if (error) throw new Error(error.message);
        return data || [];
    },

    async getById(id: string): Promise<any> {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async create(data: any): Promise<any> {
        const { data: newLesson, error } = await supabase
            .from('lessons')
            .insert([data])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newLesson;
    },

    async update(id: string, data: any): Promise<any> {
        const { data: updatedLesson, error } = await supabase
            .from('lessons')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updatedLesson;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    },
};

// Enrollment API functions
export const enrollmentAPI = {
    async enroll(courseId: string): Promise<any> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { data, error } = await supabase
            .from('enrollments')
            .insert([{ course_id: courseId, user_id: user.id }]) // Adjust column names as needed
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async getMyEnrollments(): Promise<any[]> {
        const { data, error } = await supabase
            .from('enrollments')
            .select('*, courses(*)') // Join with courses

        if (error) throw new Error(error.message);
        return data || [];
    },
};

// Progress API functions
export const progressAPI = {
    async getProgress(courseId: string): Promise<any> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // This logic might need adjustment based on how progress is stored
        const { data, error } = await supabase
            .from('progress')
            .select('*')
            .eq('course_id', courseId)
            .eq('user_id', user.id);

        if (error) throw new Error(error.message);
        return data;
    },

    async updateProgress(lessonId: string, data: any): Promise<any> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { data: updatedProgress, error } = await supabase
            .from('progress')
            .upsert({ ...data, lesson_id: lessonId, user_id: user.id })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updatedProgress;
    },
};
