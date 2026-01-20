# Quantum Perigee LMS

A modern Learning Management System (LMS) built with Next.js, Express, and PostgreSQL. Features include course management, progress tracking, invite-based enrollment, and role-based access control.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with role-based access (Student, Instructor, Admin)
- **Course Management**: Create, edit, and publish courses with lessons
- **Progress Tracking**: Track student progress through courses and lessons
- **Invite System**: Exclusive invite-based enrollment for courses
- **Modern UI**: Beautiful, responsive design with dark/light theme support
- **Video Learning**: Video player with progress tracking and resume functionality
- **Certificates**: Automatic certificate generation upon course completion
- **Reviews & Ratings**: Course review and rating system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "test aplikasi"
```

### 2. Database Setup

1. Install and start PostgreSQL
2. Create a new database:

```sql
CREATE DATABASE quantum_perigee;
```

3. Run the schema migration:

```bash
psql -U postgres -d quantum_perigee -f database/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=quantum_perigee

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

CORS_ORIGIN=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
test aplikasi/
├── backend/
│   ├── src/
│   │   ├── db/           # Database connection
│   │   ├── middleware/   # Authentication middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   └── server.ts     # Express server
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   └── lib/          # Utilities and API client
│   ├── .env.local        # Environment variables
│   └── package.json
├── database/
│   └── schema.sql        # Database schema
└── shared/
    └── types/            # Shared TypeScript types
```

## 🎯 Usage

### Creating an Account

1. Navigate to `/auth/register`
2. Choose your role (Student or Instructor)
3. Fill in your details and create an account
4. You'll be automatically logged in and redirected to the dashboard

### For Students

1. Browse courses at `/courses`
2. Click on a course to view details
3. Enroll in courses (via invite or direct enrollment)
4. Track your progress in the dashboard
5. Complete courses to earn certificates

### For Instructors

1. Create courses from the dashboard
2. Add lessons with video content
3. Manage course visibility (publish/unpublish)
4. Track student enrollments and progress
5. Send course invites to students

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor)

### Lessons
- `GET /api/lessons/course/:courseId` - Get lessons for a course
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson (Instructor)
- `PUT /api/lessons/:id` - Update lesson (Instructor)
- `DELETE /api/lessons/:id` - Delete lesson (Instructor)

### Enrollments
- `GET /api/enrollments/my` - Get user's enrollments
- `POST /api/enrollments` - Enroll in course

### Progress
- `GET /api/progress/course/:courseId` - Get progress for a course
- `POST /api/progress/lesson/:lessonId` - Update lesson progress

### Invites
- `POST /api/invites` - Create course invite (Instructor)
- `GET /api/invites/:token` - Get invite details
- `POST /api/invites/:token/accept` - Accept invite

## 🎨 Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- Role-based access control
- CORS configuration
- Helmet.js for security headers

## 🚧 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@quantumperigee.com or open an issue in the repository.
