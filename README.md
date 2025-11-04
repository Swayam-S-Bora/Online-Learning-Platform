# Online Learning Platform

A full-stack online learning platform built with React and Node.js, featuring course management, user authentication with session management, and course prerequisite relationships using Neo4j.

## Features

- **User Authentication & Authorization**: JWT-based registration and login with Redis session management
- **Course Catalog**: Browse courses stored in MongoDB with details like instructor, duration, and price
- **Course Prerequisites**: Graph-based course prerequisite relationships using Neo4j
- **Protected Routes**: Secure API endpoints with JWT middleware
- **Modern Frontend**: React UI with React Router and styled components

## Tech Stack

### Frontend
- **React**

### Backend
- **Node.js**
- **MongoDB** with Mongoose for course and user data storage
- **Redis** for JWT session management and token storage
- **Neo4j** for course prerequisite graph relationships
- **JWT** for stateless authentication tokens
- **bcryptjs** for secure password hashing
- **express-validator** for request validation
- **CORS** enabled for frontend communication

## Project Structure

```
Online-Learning-Platform/
├── platform_frontend/          # React frontend
│   ├── src/
│   │   ├── api/               # API integration
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components (CourseList, Login, Register)
│   │   ├── App.jsx            # Main app component
│   └── main.jsx               # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Node.js backend
    ├── models/
    │   ├── course.js          # Course MongoDB schema
    │   └── user.js            # User MongoDB schema
    ├── routes/
    │   ├── auth.js            # Authentication routes
    │   └── neoCourses.js      # Neo4j course prerequisite routes
    ├── middleware/
    │   └── auth.js            # JWT authentication middleware
    ├── data/
    │   ├── course-data.json   # Course seed data
    │   └── course-prereq.json # Course prerequisite seed data
    ├── seedCourses.js         # MongoDB seeding script
    ├── seedPrereqs.js         # Neo4j seeding script
    ├── redisClient.js         # Redis connection setup
    ├── neo.js                 # Neo4j driver setup
    ├── index.js               # Express server entry point
    └── package.json
```

## Installation

### Prerequisites
- Node.js
- MongoDB
- Redis
- Neo4j

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/online_learning
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

4. Seed the database:
```bash
node seedCourses.js
node seedPrereqs.js
```

5. Start the server:
```bash
node index.js
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd platform_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (validates email, username, password)
- `POST /api/auth/login` - Login and receive JWT token (stored in Redis)
- `POST /api/auth/logout` - Logout and invalidate session (removes token from Redis)

### Courses (MongoDB)
- `GET /api/courses` - Get all courses from MongoDB
- `POST /courses` - Create a new course

### Course Prerequisites (Neo4j)
- `POST /api/neo/courses` - Create a course node in Neo4j
- `POST /api/neo/courses/prerequisite` - Add prerequisite relationship between courses
- `GET /api/neo/courses/:courseCode/prerequisites` - Get all prerequisites for a course (recursive)

### Protected Routes
- `GET /api/protected` - Example protected endpoint (requires valid JWT in Authorization header)

## Authentication Flow

The platform uses JWT with Redis-backed session management:

1. **Registration**: User creates account → password hashed with bcrypt → stored in MongoDB
2. **Login**: User submits credentials → JWT token generated → token stored in Redis with 24-hour TTL → token returned to client
3. **Authorization**: Client sends token in `Authorization: Bearer <token>` header → middleware validates JWT signature → checks token exists in Redis → grants access
4. **Logout**: Client sends logout request → token removed from Redis → session invalidated
5. **Session Expiry**: Redis automatically expires tokens after 24 hours

## Data Models

### Course Model (MongoDB)

```javascript
{
  courseCode: String (unique),
  title: String,
  instructor: String,
  duration: Number,
  description: String,
  price: Number,
  timestamps: true
}
```

### User Model (MongoDB)

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed)
}
```

### Course Prerequisites (Neo4j)

Course relationships are stored as a directed graph:
- **Nodes**: `Course` with properties `courseCode` and `title`
- **Relationships**: `[:REQUIRES]` edges pointing from a course to its prerequisites
- **Query**: Supports recursive prerequisite lookup using Cypher queries

**Example**: CS110 (Full-Stack MERN) → CS108 (Frontend) → CS101 (Intro to Java)

## Seed Data

- The project includes 10 pre-configured courses in `server/data/course-data.json`
- Prerequisite relationships are defined in `server/data/course-prereq.json`

**Note**: Make sure all database services (MongoDB, Redis, Neo4j) are running before starting the application.
