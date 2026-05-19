# Team Task Manager

A professional full-stack team task management application built with React.js, Node.js, Express, MongoDB, and Tailwind CSS. This application is designed for teams to efficiently manage projects, tasks, and team members with a modern, responsive user interface.

## ?? Quick Start Guide

### Prerequisites
- Node.js (v18 or higher) - [Download Node.js](https://nodejs.org/)
- MongoDB Atlas account (free tier works) - [Create MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- npm or yarn package manager

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Team_Task_Manager
```

#### 2. Install All Dependencies
```bash
npm run install:all
```
This command installs dependencies for:
- Root project
- Backend server
- Frontend client

#### 3. Setup Environment Variables

**Backend Configuration (server/.env):**
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
JWT_EXPIRE=7d
```

**How to get MongoDB Atlas Connection String:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" ? "Connect your application"
4. Copy the connection string and replace `<password>` with your database password

**Frontend Configuration (client/.env):**
The client `.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Seed the Database (Optional - Creates Sample Data)
```bash
cd server
npm run seed
```
This creates:
- 1 Admin user: `admin@test.com` / `admin123`
- 2 Member users: `member1@test.com` / `member123`, `member2@test.com` / `member123`
- 2 Sample projects
- 5 Sample tasks with different statuses

#### 5. Run the Application

**Option 1: Run Both Server and Client Together (Recommended)**
```bash
# From the root directory
npm run dev
```
This starts:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

#### 6. Access the Application
- **Frontend:** Open your browser to `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`

## ?? Default Login Credentials

After running the seed script, use these credentials to login:

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

**Member Account 1:**
- Email: `member1@test.com`
- Password: `member123`

**Member Account 2:**
- Email: `member2@test.com`
- Password: `member123`

## ??? Tech Stack

### Frontend
- **React.js** (Vite) - Modern React framework with fast development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **Recharts** - Chart library for data visualization
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB (Mongoose)** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing

## ? Features

### User Management
- User registration and login with JWT authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcrypt
- Admin panel for user management

### Project Management
- Create, view, edit, and delete projects
- Add/remove team members to projects
- Project statistics and progress tracking
- Responsive project cards with modern UI

### Task Management
- Create, view, edit, and delete tasks
- Update task status (To Do, In Progress, Completed)
- Assign tasks to team members
- Task priority levels (Low, Medium, High)
- Due date tracking with overdue indicators
- My Tasks page for assigned tasks

### Dashboard
- Visual statistics with charts
- Project and task overview
- Status distribution
- Real-time data updates

### User Interface
- Fully responsive design (mobile, tablet, desktop)
- Modern gradient styling
- Smooth animations and transitions
- Professional Dubai client-ready UI
- Mobile navigation with hamburger menu
- Horizontal scroll hidden with smooth scrolling

## ?? Project Structure

```
/Team_Task_Manager
  /client                    ? React frontend (Vite + Tailwind)
    /src
      /components            ? Reusable components
        - AddEditModal.jsx
        - DeleteConfirmModal.jsx
        - Navbar.jsx
        - TaskCard.jsx
      /context              ? React Context API
        - AuthContext.jsx
      /pages                ? Page components
        - AdminUsers.jsx
        - Dashboard.jsx
        - Login.jsx
        - MyTasks.jsx
        - ProjectDetail.jsx
        - Projects.jsx
        - Register.jsx
      /utils                ? Utility functions
        - api.js
    /public                 ? Static assets
    package.json            ? Frontend dependencies
    tailwind.config.js      ? Tailwind configuration
    vite.config.js          ? Vite configuration

  /server                   ? Node.js + Express backend
    /models                ? Mongoose models
      - User.js
      - Project.js
      - Task.js
    /routes                ? API routes
      - auth.js
      - dashboard.js
      - projects.js
      - tasks.js
      - users.js
    /middleware             ? Express middleware
      - auth.js
      - errorHandler.js
    /config                ? Configuration files
      - db.js
    seed.js                ? Database seeding script
    server.js              ? Server entry point
    package.json           ? Backend dependencies

  package.json             ? Root package.json with scripts
  README.md                ? This file
```

## ?? Available Scripts

### Root Scripts (Run from project root)
```bash
npm run dev              # Run both server and client in development mode
npm run server           # Run server only
npm run client           # Run client only
npm run seed             # Seed the database with sample data
npm run install:all      # Install all dependencies (root, server, client)
```

### Server Scripts (Run from /server directory)
```bash
npm start                # Start server in production mode
npm run dev              # Start server in development mode with nodemon
npm run seed             # Seed the database
```

### Client Scripts (Run from /client directory)
```bash
npm run dev              # Start development server with Vite
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## ?? Environment Variables

### Backend (.env)
```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb+srv://...                # MongoDB connection string
JWT_SECRET=your_secret_key                   # JWT secret key (change in production)
JWT_EXPIRE=7d                                # JWT token expiration time
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api       # Backend API URL
```

## ?? API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current logged-in user (protected route).

**Headers:**
```
Authorization: Bearer <token>
```

### Project Endpoints

#### GET /api/projects
Get all projects (protected).

#### POST /api/projects
Create a new project (admin only).

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Project description"
}
```

#### GET /api/projects/:id
Get single project with members and tasks (protected).

#### PUT /api/projects/:id
Update project (admin only).

#### DELETE /api/projects/:id
Delete project (admin only).

#### POST /api/projects/:id/members
Add member to project (admin only).

**Request Body:**
```json
{
  "userId": "user_id_here"
}
```

#### DELETE /api/projects/:id/members/:userId
Remove member from project (admin only).

### Task Endpoints

#### GET /api/tasks?project=projectId
Get all tasks for a project (protected).

#### POST /api/tasks
Create a new task (admin only).

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2024-12-31",
  "assignedTo": "user_id_here",
  "project": "project_id_here"
}
```

#### GET /api/tasks/:id
Get single task (protected).

#### PUT /api/tasks/:id
Update task (admin can update all fields, member can only update status).

#### DELETE /api/tasks/:id
Delete task (admin only).

#### GET /api/tasks/my-tasks/all
Get tasks assigned to logged-in user (protected).

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics (protected).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 2,
    "totalTasks": 5,
    "completedTasks": 1,
    "overdueTasks": 1,
    "tasksByStatus": {
      "todo": 2,
      "in-progress": 2,
      "completed": 1
    }
  }
}
```

### User Endpoints (Admin Only)

#### GET /api/users
Get all users (admin only).

## ?? Deployment

### Deploy to Railway

#### Backend Deployment

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `PORT`: 5000
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRE`: 7d
4. Set root directory to `server`
5. Set start command to `node server.js`
6. Deploy

#### Frontend Deployment

1. Create a new project on [Railway](https://railway.app) or [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.railway.app/api`)
4. Set root directory to `client`
5. Set build command to `npm run build`
6. Set start command to `npm run preview`
7. Deploy

### Deploy to Vercel (Frontend Only)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Set root directory to `client`
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL
5. Deploy

### Deploy to Render (Backend Only)

1. Create a new web service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set root directory to `server`
4. Add environment variables:
   - `PORT`: 5000
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRE`: 7d
5. Set start command to `node server.js`
6. Deploy

## ?? Security Notes

- Change `JWT_SECRET` in production environment
- Use strong passwords for MongoDB Atlas
- Enable MongoDB Atlas IP whitelist for production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Keep dependencies updated

## ?? Troubleshooting

### Common Issues

**Issue: MongoDB Connection Failed**
- Verify your MongoDB Atlas connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB cluster is running

**Issue: Port Already in Use**
- Change the PORT in server/.env file
- Kill the process using the port: `npx kill-port 5000`

**Issue: CORS Errors**
- Verify VITE_API_URL in client/.env matches your backend URL
- Check CORS configuration in server/server.js

**Issue: Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is v18 or higher

## ?? License

ISC

## ?? Support

For issues and questions, please open an issue on the GitHub repository or contact the development team.

## API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

#### POST /api/auth/login
Login with email and password.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current logged-in user (protected).

**Headers:**
```
Authorization: Bearer <token>
```

### Projects

#### GET /api/projects
Get all projects (protected).

#### POST /api/projects
Create a new project (admin only).

#### GET /api/projects/:id
Get single project with members and tasks (protected).

#### PUT /api/projects/:id
Update project (admin only).

#### DELETE /api/projects/:id
Delete project (admin only).

#### POST /api/projects/:id/members
Add member to project (admin only).

#### DELETE /api/projects/:id/members/:userId
Remove member from project (admin only).

### Tasks

#### GET /api/tasks?project=projectId
Get all tasks for a project (protected).

#### POST /api/tasks
Create a new task (admin only).

#### GET /api/tasks/:id
Get single task (protected).

#### PUT /api/tasks/:id
Update task (admin can update all fields, member can only update status).

#### DELETE /api/tasks/:id
Delete task (admin only).

#### GET /api/tasks/my-tasks/all
Get tasks assigned to logged-in user (protected).

### Dashboard

#### GET /api/dashboard/stats
Get dashboard statistics (protected).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 2,
    "totalTasks": 5,
    "completedTasks": 1,
    "overdueTasks": 1,
    "tasksByStatus": {
      "todo": 2,
      "in-progress": 2,
      "completed": 1
    }
  }
}
```

### Users (Admin Only)

#### GET /api/users
Get all users (admin only).

## Default Login Credentials

After running the seed script, you can use these credentials:

**Admin:**
- Email: `admin@test.com`
- Password: `admin123`

**Member 1:**
- Email: `member1@test.com`
- Password: `member123`

**Member 2:**
- Email: `member2@test.com`
- Password: `member123`

## Deployment

### Deploy to Railway

#### Backend Deployment

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `PORT`: 5000
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRE`: 7d
4. Set root directory to `server`
5. Set start command to `node server.js`
6. Deploy

#### Frontend Deployment

1. Create a new project on [Railway](https://railway.app) or [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.railway.app/api`)
4. Set root directory to `client`
5. Set build command to `npm run build`
6. Set start command to `npm run preview`
7. Deploy

## Scripts

### Root Scripts
- `npm run dev` - Run both server and client in development mode
- `npm run server` - Run server only
- `npm run client` - Run client only
- `npm run seed` - Seed the database with sample data
- `npm run install:all` - Install all dependencies

### Server Scripts
- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon
- `npm run seed` - Seed the database

### Client Scripts
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.
