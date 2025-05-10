# Taskaty Technical Documentation

## Architecture Overview

Taskaty follows a client-server architecture with a React frontend and Node.js backend. The application uses MongoDB as its database and implements real-time features using Socket.IO.

## Frontend Architecture

### State Management
- **Zustand Store**: Used for global state management
  - Task store for managing task state
  - Project store for managing project state
  - User store for managing user state

### Authentication Flow
1. User submits login/register form
2. Frontend sends credentials to backend
3. Backend validates and returns JWT token in HTTP-only cookie
4. Frontend stores user info in Zustand store
5. Protected routes check for authentication

### API Integration
- Axios instance configured with:
  - Base URL from environment variables
  - Credentials included for cookie handling
  - Request/response interceptors for error handling
  - Automatic token management

### Component Structure
- **Pages**: Main route components
  - Auth: Login/Register
  - Dashboard: Main application view
  - Tasks: Task management
  - Projects: Project management
  - Settings: User settings

- **Components**: Reusable UI components
  - TaskCard: Individual task display
  - ProjectCard: Individual project display
  - KanbanBoard: Task board view
  - Calendar: Calendar view
  - Navigation: App navigation

## Backend Architecture

### Authentication System
- JWT-based authentication
- HTTP-only cookies for token storage
- Email verification system
- Password reset functionality
- Middleware for route protection

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  birthDate: Date,
  isAccountVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  content: String,
  startDate: Date,
  dueDate: Date,
  priority: Enum ['low', 'medium', 'high'],
  status: Enum ['To Do', 'In Progress', 'Done'],
  progress: Number,
  assignees: [User],
  projectId: Project,
  createdBy: User,
  comments: [{
    user: User,
    text: String,
    createdAt: Date
  }]
}
```

#### Project Model
```javascript
{
  name: String,
  description: String,
  status: String,
  dueDate: Date,
  leader: User,
  teamMembers: [User],
  tasks: [Task],
  lastViews: [{
    user: User,
    date: Date
  }]
}
```

### API Routes

#### Authentication Routes
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/reset-password
GET /api/auth/verify-email
```

#### Task Routes
```javascript
GET /api/task/me
POST /api/task
PUT /api/task/:id
DELETE /api/task/:id
```

#### Project Routes
```javascript
GET /api/project/me
POST /api/project
PUT /api/project/:id
DELETE /api/project/:id
```

### Middleware
- **verifyToken**: JWT token verification
- **validateLogin**: Login request validation
- **validateRegister**: Registration request validation
- **errorHandler**: Global error handling

### Real-time Features
- Socket.IO implementation for:
  - Real-time task updates
  - Project activity notifications
  - Team chat functionality

## Security Measures

### Frontend Security
- HTTP-only cookies for token storage
- CSRF protection
- Input validation
- XSS prevention
- Secure password handling

### Backend Security
- Password hashing with bcrypt
- JWT token validation
- Rate limiting
- CORS configuration
- Input sanitization
- Error handling

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Memoization
- Optimistic updates
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Caching
- Connection pooling
- Error handling

## Testing Strategy

### Frontend Testing
- Unit tests for components
- Integration tests for features
- E2E tests for critical paths
- Performance testing

### Backend Testing
- Unit tests for controllers
- Integration tests for routes
- Database testing
- API testing

## Deployment

### Frontend Deployment
- Build optimization
- Static file serving
- CDN integration
- Environment configuration

### Backend Deployment
- Process management
- Database backup
- SSL/TLS configuration
- Monitoring setup

## Monitoring and Logging

### Frontend Monitoring
- Error tracking
- Performance monitoring
- User analytics
- Console logging

### Backend Monitoring
- Request logging
- Error tracking
- Performance metrics
- Database monitoring

## Future Improvements

### Planned Features
- Social authentication
- File attachments
- Advanced reporting
- Mobile app
- API rate limiting
- Advanced search
- Export functionality

### Technical Improvements
- Microservices architecture
- GraphQL implementation
- WebSocket optimization
- Caching layer
- Load balancing 