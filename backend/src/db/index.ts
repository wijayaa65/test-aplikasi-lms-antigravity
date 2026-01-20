import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'quantum_perigee',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// ============================================
// MOCK DATA FOR DEVELOPMENT (No PostgreSQL)
// ============================================

// Pre-hashed passwords (bcrypt hash of each password)
// student@demo.com: demo123
// instructor@demo.com: demo123
// admin@demo.com: admin123
const DEMO_PASSWORD_HASH = '$2b$10$rBV2JudLMx3qQF6.H.g.3.7q8.vYxQqR7N9XuR0R8HsKsL3Ym6FfC'; // demo123
const ADMIN_PASSWORD_HASH = '$2b$10$rBV2JudLMx3qQF6.H.g.3.QjK8xY5ZrP.R7N9XuR0R8HsKsL3Ym6a'; // admin123

// In-memory store for registered users
const mockUsers: any[] = [
    {
        id: 'usr-1-student',
        email: 'student@demo.com',
        password_hash: DEMO_PASSWORD_HASH,
        full_name: 'Demo Student',
        role: 'student',
        avatar_url: null,
        created_at: new Date()
    },
    {
        id: 'usr-2-instructor',
        email: 'instructor@demo.com',
        password_hash: DEMO_PASSWORD_HASH,
        full_name: 'Demo Instructor',
        role: 'instructor',
        avatar_url: null,
        created_at: new Date()
    },
    {
        id: 'usr-3-admin',
        email: 'admin@demo.com',
        password_hash: ADMIN_PASSWORD_HASH,
        full_name: 'Admin User',
        role: 'admin',
        avatar_url: null,
        created_at: new Date()
    },
];

const mockCourses = [
    { id: 'crs-1', title: 'Introduction to React', description: 'Learn the basics of React including components, state, and props.', instructor_id: 'usr-2-instructor', category: 'Web Development', level: 'Beginner', price: 0, published: true, thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60', created_at: new Date() },
    { id: 'crs-2', title: 'Advanced TypeScript', description: 'Deep dive into TypeScript generics, decorators, and advanced patterns.', instructor_id: 'usr-2-instructor', category: 'Web Development', level: 'Advanced', price: 49.99, published: true, thumbnail_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60', created_at: new Date() },
    { id: 'crs-3', title: 'Modern Backend with Node.js', description: 'Build scalable REST APIs with Express, authentication, and databases.', instructor_id: 'usr-2-instructor', category: 'Backend', level: 'Intermediate', price: 29.99, published: true, thumbnail_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60', created_at: new Date() },
];

const mockEnrollments: any[] = [
    { id: 'enr-1', user_id: 'usr-1-student', course_id: 'crs-1', enrolled_at: new Date() },
];

// Counter for generating new IDs
let userIdCounter = 4;
let enrollmentIdCounter = 2;

// ============================================
// QUERY FUNCTION WITH MOCK FALLBACK
// ============================================

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();

    // EXPLICIT MOCK MODE: Skip real DB connection entirely
    if (process.env.MOCK_DB === 'true') {
        return handleMockQuery(text, params);
    }

    try {
        const res = await pool.query(text, params);
        return res;
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('DB connection failed, using mock data for query:', text.substring(0, 100));
            return handleMockQuery(text, params);
        }
        throw err;
    }
};

function handleMockQuery(text: string, params?: any[]): { rows: any[], rowCount: number } {
    const normalizedText = text.trim().replace(/\s+/g, ' ').toUpperCase();

    // ========== USER QUERIES ==========

    // Find user by email (login)
    if (normalizedText.includes('FROM USERS') && normalizedText.includes('WHERE EMAIL = $1')) {
        const email = params?.[0]?.toLowerCase();
        const user = mockUsers.find(u => u.email.toLowerCase() === email);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // Find user by ID (get current user)
    if (normalizedText.includes('FROM USERS') && normalizedText.includes('WHERE ID = $1')) {
        const id = params?.[0];
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            // Return without password_hash for security
            const { password_hash, ...safeUser } = user;
            return { rows: [safeUser], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
    }

    // Insert new user (registration)
    if (normalizedText.includes('INSERT INTO USERS')) {
        const [email, password_hash, full_name, role] = params || [];
        const newUser = {
            id: `usr-${userIdCounter++}-${role}`,
            email,
            password_hash,
            full_name,
            role,
            avatar_url: null,
            created_at: new Date()
        };
        mockUsers.push(newUser);
        console.log('Mock: Created new user:', newUser.email);
        return { rows: [newUser], rowCount: 1 };
    }

    // ========== COURSE QUERIES ==========

    if (normalizedText.includes('FROM COURSES')) {
        let courses = [...mockCourses];

        // Filter by published
        if (normalizedText.includes('WHERE PUBLISHED = TRUE')) {
            courses = courses.filter(c => c.published === true);
        }

        // Filter by ID
        if (normalizedText.includes('WHERE ID = $1') && params?.[0]) {
            courses = courses.filter(c => c.id === params[0]);
        }

        // Filter by instructor
        if (normalizedText.includes('WHERE INSTRUCTOR_ID = $1') && params?.[0]) {
            courses = courses.filter(c => c.instructor_id === params[0]);
        }

        return { rows: courses, rowCount: courses.length };
    }

    // ========== ENROLLMENT QUERIES ==========

    if (normalizedText.includes('FROM ENROLLMENTS')) {
        let enrollments = [...mockEnrollments];

        // 1. Find by User (My Enrollments) - Includes JOIN COURSES
        if (normalizedText.includes('JOIN COURSES') && (normalizedText.includes('WHERE E.USER_ID = $1') || normalizedText.includes('WHERE USER_ID = $1'))) {
            const userId = params?.[0];
            enrollments = enrollments.filter(e => e.user_id === userId);

            // Map to expected output structure with flattened course details: title as course_title, thumbnail_url
            const results = enrollments.map(e => {
                const course = mockCourses.find(c => c.id === e.course_id);
                return {
                    ...e,
                    course_title: course?.title,
                    thumbnail_url: course?.thumbnail_url
                };
            });

            return { rows: results, rowCount: results.length };
        }

        // 2. Find by Course (Course Students) - Includes JOIN USERS
        if (normalizedText.includes('JOIN USERS') && (normalizedText.includes('WHERE E.COURSE_ID = $1') || normalizedText.includes('WHERE COURSE_ID = $1'))) {
            const courseId = params?.[0];
            enrollments = enrollments.filter(e => e.course_id === courseId);

            // Map to expected output structure: full_name as student_name, email as student_email
            const results = enrollments.map(e => {
                const user = mockUsers.find(u => u.id === e.user_id);
                return {
                    ...e,
                    student_name: user?.full_name,
                    student_email: user?.email
                };
            });

            return { rows: results, rowCount: results.length };
        }

        // 3. Simple Exist Check or Simple List
        if (normalizedText.includes('WHERE USER_ID = $1') && normalizedText.includes('AND COURSE_ID = $2')) {
            const [userId, courseId] = params || [];
            enrollments = enrollments.filter(e => e.user_id === userId && e.course_id === courseId);
            return { rows: enrollments, rowCount: enrollments.length };
        }

        return { rows: enrollments, rowCount: enrollments.length };
    }

    // Insert enrollment
    if (normalizedText.includes('INSERT INTO ENROLLMENTS')) {
        const [user_id, course_id] = params || [];
        const newEnrollment = {
            id: `enr-${enrollmentIdCounter++}`,
            user_id,
            course_id,
            enrolled_at: new Date()
        };
        mockEnrollments.push(newEnrollment);
        console.log('Mock: Created enrollment for user:', user_id);
        return { rows: [newEnrollment], rowCount: 1 };
    }

    // ========== DEFAULT ==========
    console.warn('Mock: Unhandled query pattern:', normalizedText.substring(0, 80));
    return { rows: [], rowCount: 0 };
}

// ============================================
// DATABASE CLIENT
// ============================================

export const getClient = async () => {
    // EXPLICIT MOCK MODE
    if (process.env.MOCK_DB === 'true') {
        return {
            query: (text: string, params?: any[]) => query(text, params),
            release: () => { },
        } as any;
    }

    try {
        const client = await pool.connect();
        return client;
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('DB connection failed, providing mock client');
            return {
                query: (text: string, params?: any[]) => query(text, params),
                release: () => { },
            } as any;
        }
        throw err;
    }
};

// Helper to verify passwords (used by mock login)
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    // Check hardcoded mocks first
    if (hash === DEMO_PASSWORD_HASH && password === 'demo123') return true;
    if (hash === ADMIN_PASSWORD_HASH && password === 'admin123') return true;

    try {
        return await bcrypt.compare(password, hash);
    } catch {
        return false;
    }
};

export default pool;
