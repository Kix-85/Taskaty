# Taskaty - Task Management System

Taskaty is a modern task management system built with React, Node.js, and MongoDB. It provides a comprehensive solution for managing tasks, projects, and team collaboration.

## Features

### Authentication
- Email-based authentication
- JWT-based secure authentication
- Email verification system
- Password reset functionality
- Social authentication (coming soon)

### Task Management
- Create, read, update, and delete tasks
- Task status tracking (To Do, In Progress, Done)
- Task prioritization (Low, Medium, High)
- Task assignment to team members
- Task comments and discussions
- Task progress tracking
- Due date management

### Project Management
- Create and manage projects
- Team member management
- Project status tracking
- Project activity monitoring
- Project deadline management

### User Interface
- Modern and responsive design
- Multiple view options (Kanban, List, Calendar)
- Real-time updates
- Dark/Light mode support
- Mobile-friendly interface

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- Zustand for state management
- React Query for data fetching
- Axios for API requests
- Socket.IO for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time communication
- Nodemailer for email services
- Bcrypt for password hashing

## Project Structure

```
Taskaty/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
└── Backend/                 # Node.js backend application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middlewares/        # Custom middlewares
    ├── models/            # Mongoose models
    ├── routers/           # API routes
    └── utils/             # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Taskaty.git
cd Taskaty
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../Backend
npm install
```

4. Create environment files:

Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
```

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd Backend
npm run dev
```

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/reset-password` - Request password reset
- GET `/api/auth/verify-email` - Verify email address

### Task Endpoints
- GET `/api/task/me` - Get user's tasks
- POST `/api/task` - Create a new task
- PUT `/api/task/:id` - Update a task
- DELETE `/api/task/:id` - Delete a task

### Project Endpoints
- GET `/api/project/me` - Get user's projects
- POST `/api/project` - Create a new project
- PUT `/api/project/:id` - Update a project
- DELETE `/api/project/:id` - Delete a project

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO](https://socket.io/) 