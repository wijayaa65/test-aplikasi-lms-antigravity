const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'instructor' | 'admin';
    avatar?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

// Token management
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
};

// API client with auth headers and timeout
export const apiClient = async (
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 10000
): Promise<Response> => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Merge existing headers
    if (options.headers) {
        const existingHeaders = new Headers(options.headers);
        existingHeaders.forEach((value, key) => {
            headers[key] = value;
        });
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });

        return response;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - server took too long to respond');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

// Auth API functions
export const authAPI = {
    async register(email: string, password: string, fullName: string, role: string): Promise<AuthResponse> {
        const response = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName, role }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async getCurrentUser(): Promise<User> {
        const response = await apiClient('/auth/me');

        if (!response.ok) {
            throw new Error('Failed to get current user');
        }

        return response.json();
    },

    logout(): void {
        removeToken();
    },
};

// Course API functions
export const courseAPI = {
    async getAll(): Promise<any[]> {
        const response = await apiClient('/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
    },

    async getById(id: string): Promise<any> {
        const response = await apiClient(`/courses/${id}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        return response.json();
    },

    async create(data: any): Promise<any> {
        const response = await apiClient('/courses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create course');
        return response.json();
    },

    async update(id: string, data: any): Promise<any> {
        const response = await apiClient(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update course');
        return response.json();
    },
};

// Lesson API functions
export const lessonAPI = {
    async getByCourse(courseId: string): Promise<any[]> {
        const response = await apiClient(`/lessons/course/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch lessons');
        return response.json();
    },

    async getById(id: string): Promise<any> {
        const response = await apiClient(`/lessons/${id}`);
        if (!response.ok) throw new Error('Failed to fetch lesson');
        return response.json();
    },

    async create(data: any): Promise<any> {
        const response = await apiClient('/lessons', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create lesson');
        return response.json();
    },

    async update(id: string, data: any): Promise<any> {
        const response = await apiClient(`/lessons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update lesson');
        return response.json();
    },

    async delete(id: string): Promise<void> {
        const response = await apiClient(`/lessons/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete lesson');
    },
};

// Enrollment API functions
export const enrollmentAPI = {
    async enroll(courseId: string): Promise<any> {
        const response = await apiClient('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ courseId }),
        });
        if (!response.ok) throw new Error('Failed to enroll');
        return response.json();
    },

    async getMyEnrollments(): Promise<any[]> {
        const response = await apiClient('/enrollments/my');
        if (!response.ok) throw new Error('Failed to fetch enrollments');
        return response.json();
    },
};

// Progress API functions
export const progressAPI = {
    async getProgress(courseId: string): Promise<any> {
        const response = await apiClient(`/progress/course/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        return response.json();
    },

    async updateProgress(lessonId: string, data: any): Promise<any> {
        const response = await apiClient(`/progress/lesson/${lessonId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update progress');
        return response.json();
    },
};
