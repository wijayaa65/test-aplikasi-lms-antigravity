import express from 'express';
import { ProgressModel } from '../models/Progress';
import { CourseModel } from '../models/Course';
import { EnrollmentModel } from '../models/Enrollment';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Update process for a lesson
router.post('/update', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { courseId, lessonId, completed, watchTime, lastPosition } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Verify enrollment
        const isEnrolled = await EnrollmentModel.exists(req.user.userId, courseId);
        if (!isEnrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

        const progress = await ProgressModel.upsert(req.user.userId, courseId, lessonId, {
            completed,
            watchTime,
            lastPosition
        });

        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get my progress for a course
router.get('/course/:courseId', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { courseId } = req.params;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const progressDetails = await ProgressModel.findByUserAndCourse(req.user.userId, courseId);
        const stats = await ProgressModel.getCourseProgress(req.user.userId, courseId);

        res.json({
            details: progressDetails,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student progress (Instructor only)
router.get('/instructor/:courseId/student/:studentId', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { courseId, studentId } = req.params;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Verify course ownership
        const course = await CourseModel.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role !== 'admin' && course.instructor_id !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const progressDetails = await ProgressModel.findByUserAndCourse(studentId, courseId);
        const stats = await ProgressModel.getCourseProgress(studentId, courseId);

        res.json({
            studentId,
            courseId,
            details: progressDetails,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
