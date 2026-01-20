import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import inviteRoutes from './routes/invites';
import enrollmentRoutes from './routes/enrollments';
import progressRoutes from './routes/progress';
import lessonRoutes from './routes/lessons';

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'quantum-perigee-backend' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
