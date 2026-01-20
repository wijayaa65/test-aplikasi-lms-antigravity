import { query } from '../db';
import { Invite } from '../../../shared/types';
import crypto from 'crypto';

export class InviteModel {
    static async create(courseId: string, email: string, invitedBy: string) {
        const token = crypto.randomBytes(32).toString('hex');
        // Expires in 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const result = await query(
            `INSERT INTO invites (course_id, email, token, status, invited_by, expires_at) 
       VALUES ($1, $2, $3, 'pending', $4, $5) 
       RETURNING *`,
            [courseId, email, token, invitedBy, expiresAt]
        );
        return result.rows[0];
    }

    static async findByToken(token: string) {
        const result = await query(
            'SELECT * FROM invites WHERE token = $1',
            [token]
        );
        return result.rows[0];
    }

    static async findByCourse(courseId: string) {
        const result = await query(
            'SELECT * FROM invites WHERE course_id = $1 ORDER BY created_at DESC',
            [courseId]
        );
        return result.rows;
    }

    static async accept(id: string) {
        const result = await query(
            `UPDATE invites SET status = 'accepted' WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }
}
