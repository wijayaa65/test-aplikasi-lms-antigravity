import { query } from '../db';
import { Course } from '../../../shared/types';

export class CourseModel {
    static async findAll(publishedOnly = true) {
        let sql = 'SELECT * FROM courses';
        if (publishedOnly) {
            sql += ' WHERE published = true';
        }
        sql += ' ORDER BY created_at DESC';
        const result = await query(sql);
        return result.rows;
    }

    static async findById(id: string) {
        const result = await query(
            'SELECT * FROM courses WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByInstructor(instructorId: string) {
        const result = await query(
            'SELECT * FROM courses WHERE instructor_id = $1 ORDER BY created_at DESC',
            [instructorId]
        );
        return result.rows;
    }

    static async create(course: Partial<Course>) {
        const { title, description, instructorId, thumbnailUrl, price, published } = course;
        const result = await query(
            `INSERT INTO courses (title, description, instructor_id, thumbnail_url, price, published) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [title, description, instructorId, thumbnailUrl, price || 0, published || false]
        );
        return result.rows[0];
    }

    static async update(id: string, course: Partial<Course>) {
        const fields = [];
        const values = [];
        let idx = 1;

        if (course.title !== undefined) { fields.push(`title = $${idx++}`); values.push(course.title); }
        if (course.description !== undefined) { fields.push(`description = $${idx++}`); values.push(course.description); }
        if (course.thumbnailUrl !== undefined) { fields.push(`thumbnail_url = $${idx++}`); values.push(course.thumbnailUrl); }
        if (course.price !== undefined) { fields.push(`price = $${idx++}`); values.push(course.price); }
        if (course.published !== undefined) { fields.push(`published = $${idx++}`); values.push(course.published); }

        if (fields.length === 0) return null;

        values.push(id);
        const result = await query(
            `UPDATE courses SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    static async delete(id: string) {
        await query('DELETE FROM courses WHERE id = $1', [id]);
    }
}
