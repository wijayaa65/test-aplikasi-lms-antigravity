import { query } from '../db';
import { Progress } from '../../../shared/types';

export class ProgressModel {
    static async upsert(userId: string, courseId: string, lessonId: string, data: Partial<Progress>) {
        const { completed, watchTime, lastPosition } = data;

        // Check if exists
        const existing = await query(
            'SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2',
            [userId, lessonId]
        );

        let result;
        if (existing.rows.length > 0) {
            // Update
            const fields = [];
            const values = [];
            let idx = 1;

            if (completed !== undefined) { fields.push(`completed = $${idx++}`); values.push(completed); }
            if (watchTime !== undefined) { fields.push(`watch_time = $${idx++}`); values.push(watchTime); }
            if (lastPosition !== undefined) { fields.push(`last_position = $${idx++}`); values.push(lastPosition); }

            // Update timestamps
            fields.push(`last_accessed = CURRENT_TIMESTAMP`);
            if (completed) {
                fields.push(`completed_at = CURRENT_TIMESTAMP`);
            }

            values.push(userId, lessonId);

            result = await query(
                `UPDATE progress SET ${fields.join(', ')} 
         WHERE user_id = $${idx} AND lesson_id = $${idx + 1} 
         RETURNING *`,
                values
            );
        } else {
            // Create
            result = await query(
                `INSERT INTO progress (user_id, course_id, lesson_id, completed, watch_time, last_position, completed_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
                [
                    userId,
                    courseId,
                    lessonId,
                    completed || false,
                    watchTime || 0,
                    lastPosition || 0,
                    completed ? new Date() : null
                ]
            );
        }

        return result.rows[0];
    }

    static async findByUserAndCourse(userId: string, courseId: string) {
        const result = await query(
            `SELECT p.*, l.title as lesson_title 
       FROM progress p
       JOIN lessons l ON p.lesson_id = l.id
       WHERE p.user_id = $1 AND p.course_id = $2`,
            [userId, courseId]
        );
        return result.rows;
    }

    static async getCourseProgress(userId: string, courseId: string) {
        // Get total lessons
        const totalLessonsRes = await query(
            'SELECT COUNT(*) as count FROM lessons WHERE course_id = $1',
            [courseId]
        );

        // Get completed lessons
        const completedLessonsRes = await query(
            'SELECT COUNT(*) as count FROM progress WHERE user_id = $1 AND course_id = $2 AND completed = true',
            [userId, courseId]
        );

        const total = parseInt(totalLessonsRes.rows[0].count);
        const completed = parseInt(completedLessonsRes.rows[0].count);

        return {
            totalLessons: total,
            completedLessons: completed,
            percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    }
}
