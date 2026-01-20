import express from 'express';
import { CourseModel } from '../models/Course';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all published courses
router.get('/', async (req, res) => {
    try {
        const courses = await CourseModel.findAll(true);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create course (Instructor only)
router.post('/', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const { title, description, thumbnailUrl, price, published } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const course = await CourseModel.create({
            title,
            description,
            instructorId: req.user.userId,
            thumbnailUrl,
            price,
            published
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update course (Instructor only)
router.put('/:id', authenticateToken, authorizeRole(['instructor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check ownership
        if (req.user?.role !== 'admin' && course.instructor_id !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await CourseModel.update(req.params.id, req.body);
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
