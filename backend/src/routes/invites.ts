import express from 'express';
import { InviteModel } from '../models/Invite';
import { CourseModel } from '../models/Course';
import { EnrollmentModel } from '../models/Enrollment';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create Invite (Instructor only)
router.post('/', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { courseId, email } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Verify course ownership
        const course = await CourseModel.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role !== 'admin' && course.instructor_id !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const invite = await InviteModel.create(courseId, email, req.user.userId);

        // In a real app, send email here. For now, return token.
        res.status(201).json({
            message: 'Invite created',
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${invite.token}`,
            invite
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Accept Invite
router.post('/accept', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { token } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const invite = await InviteModel.findByToken(token);
        if (!invite) return res.status(404).json({ message: 'Invalid token' });

        if (invite.status !== 'pending') {
            return res.status(400).json({ message: 'Invite already used or expired' });
        }

        // Check if user email matches invite email (optional security measure)
        // For simplicity, allowing any authenticated user to accept if they have the token

        // Enroll user
        const enrolled = await EnrollmentModel.exists(req.user.userId, invite.course_id);
        if (enrolled) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        await EnrollmentModel.create(req.user.userId, invite.course_id);
        await InviteModel.accept(invite.id);

        res.json({ message: 'Successfully enrolled' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
