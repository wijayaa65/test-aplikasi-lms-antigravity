import express from 'express';
import { EnrollmentModel } from '../models/Enrollment';
import { CourseModel } from '../models/Course';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get my enrollments
router.get('/my', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const enrollments = await EnrollmentModel.findByUser(req.user.userId);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get course students (Instructor only)
router.get('/course/:courseId/students', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { courseId } = req.params;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Verify ownership
        const course = await CourseModel.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role !== 'admin' && course.instructor_id !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const students = await EnrollmentModel.findByCourse(courseId);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
