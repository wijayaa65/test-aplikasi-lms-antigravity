import express from 'express';
import { LessonModel } from '../models/Lesson';
import { CourseModel } from '../models/Course';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all lessons for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const lessons = await LessonModel.findAll(req.params.courseId);
        res.json(lessons);
    } catch (error) {
        console.error('Get lessons error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single lesson
router.get('/:id', async (req, res) => {
    try {
        const lesson = await LessonModel.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create lesson (Instructor only)
router.post('/', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { courseId, title, description, videoUrl, duration, position, isPublished } = req.body;

        if (!courseId || !title || position === undefined) {
            return res.status(400).json({ message: 'Course ID, title, and position are required' });
        }

        // Verify course exists and user has permission
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (req.user?.role !== 'admin' && course.instructor_id !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
        }

        const lesson = await LessonModel.create({
            courseId,
            title,
            description,
            videoUrl,
            duration,
            position,
            isPublished
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update lesson (Instructor only)
router.put('/:id', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const lesson = await LessonModel.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Verify course ownership
        const course = await CourseModel.findById(lesson.course_id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (req.user?.role !== 'admin' && course.instructor_id !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to update this lesson' });
        }

        const updatedLesson = await LessonModel.update(req.params.id, req.body);
        res.json(updatedLesson);
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete lesson (Instructor only)
router.delete('/:id', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const lesson = await LessonModel.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Verify course ownership
        const course = await CourseModel.findById(lesson.course_id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (req.user?.role !== 'admin' && course.instructor_id !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this lesson' });
        }

        await LessonModel.delete(req.params.id);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reorder lessons (Instructor only)
router.post('/course/:courseId/reorder', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { lessonIds } = req.body;

        if (!Array.isArray(lessonIds)) {
            return res.status(400).json({ message: 'lessonIds must be an array' });
        }

        // Verify course ownership
        const course = await CourseModel.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (req.user?.role !== 'admin' && course.instructor_id !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to reorder lessons in this course' });
        }

        await LessonModel.reorderLessons(req.params.courseId, lessonIds);
        res.json({ message: 'Lessons reordered successfully' });
    } catch (error) {
        console.error('Reorder lessons error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
