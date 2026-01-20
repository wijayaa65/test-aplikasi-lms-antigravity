import { query } from '../db';

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    duration: number;
    position: number;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateLessonInput {
    courseId: string;
    title: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    position: number;
    isPublished?: boolean;
}

export interface UpdateLessonInput {
    title?: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    position?: number;
    isPublished?: boolean;
}

export class LessonModel {
    static async findAll(courseId: string): Promise<Lesson[]> {
        const result = await query(
            'SELECT * FROM lessons WHERE course_id = $1 ORDER BY position ASC',
            [courseId]
        );
        return result.rows;
    }

    static async findById(id: string): Promise<Lesson | null> {
        const result = await query(
            'SELECT * FROM lessons WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    static async create(input: CreateLessonInput): Promise<Lesson> {
        const result = await query(
            `INSERT INTO lessons (course_id, title, description, video_url, duration, position, is_published)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                input.courseId,
                input.title,
                input.description || null,
                input.videoUrl || null,
                input.duration || 0,
                input.position,
                input.isPublished || false
            ]
        );
        return result.rows[0];
    }

    static async update(id: string, input: UpdateLessonInput): Promise<Lesson | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (input.title !== undefined) {
            fields.push(`title = $${paramCount++}`);
            values.push(input.title);
        }
        if (input.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(input.description);
        }
        if (input.videoUrl !== undefined) {
            fields.push(`video_url = $${paramCount++}`);
            values.push(input.videoUrl);
        }
        if (input.duration !== undefined) {
            fields.push(`duration = $${paramCount++}`);
            values.push(input.duration);
        }
        if (input.position !== undefined) {
            fields.push(`position = $${paramCount++}`);
            values.push(input.position);
        }
        if (input.isPublished !== undefined) {
            fields.push(`is_published = $${paramCount++}`);
            values.push(input.isPublished);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await query(
            `UPDATE lessons SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    static async delete(id: string): Promise<boolean> {
        const result = await query(
            'DELETE FROM lessons WHERE id = $1',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    static async reorderLessons(courseId: string, lessonIds: string[]): Promise<void> {
        // Update positions based on array order
        for (let i = 0; i < lessonIds.length; i++) {
            await query(
                'UPDATE lessons SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND course_id = $3',
                [i, lessonIds[i], courseId]
            );
        }
    }
}
