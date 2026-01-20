import { query, verifyPassword } from '../db';
import { User, UserRole } from '../../../shared/types';
import bcrypt from 'bcrypt';

export class UserModel {
    static async findByEmail(email: string) {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }
    static async findById(id: string) {
        const result = await query(
            'SELECT id, email, full_name, role, avatar_url, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async create(email: string, passwordHash: string, fullName: string, role: UserRole) {
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, role, created_at`,
            [email, passwordHash, fullName, role]
        );
        return result.rows[0];
    }
    static async comparePassword(password: string, hash: string) {
        return await verifyPassword(password, hash);
    }

    static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
