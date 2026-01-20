import { query } from '../db';

export class EnrollmentModel {
    static async create(userId: string, courseId: string) {
        const result = await query(
            `INSERT INTO enrollments (user_id, course_id) 
       VALUES ($1, $2) 
       RETURNING *`,
            [userId, courseId]
        );
        return result.rows[0];
    }

    static async exists(userId: string, courseId: string) {
        const result = await query(
            'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [userId, courseId]
        );
        return result.rows.length > 0;
    }

    static async findByUser(userId: string) {
        // Join with courses to get course details
        const result = await query(
            `SELECT e.*, c.title as course_title, c.thumbnail_url 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       WHERE e.user_id = $1`,
            [userId]
        );
        return result.rows;
    }

    static async findByCourse(courseId: string) {
        const result = await query(
            `SELECT e.*, u.full_name as student_name, u.email as student_email 
       FROM enrollments e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.course_id = $1`,
            [courseId]
        );
        return result.rows;
    }
}
