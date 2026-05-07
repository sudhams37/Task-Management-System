# TeamTask - Team Task Manager

A premium, collaborative project management application built with the MERN stack.

## 🚀 Live Demo
[Link to Railway Deployment] (To be added after deployment)

## ✨ Features

- **Premium UI**: Modern dark theme with glassmorphism and smooth animations using Framer Motion.
- **Authentication**: Secure JWT-based authentication with role-based access control (Admin/Member).
- **Project Management**: Create projects, manage team members, and track progress.
- **Task Board**: Intuitive Kanban-style task board for tracking To Do, In Progress, and Done tasks.
- **Dynamic Dashboard**: Visual statistics showing total tasks, overdue tasks, and assignments.
- **Responsive Design**: Fully responsive layout optimized for all screen sizes.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Axios, Tailwind CSS.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.
- **Database**: MongoDB (Mongoose).
- **Deployment**: Railway.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or local)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Usage

1. **Sign Up**: Create an account as an Admin or Member.
2. **Create Project**: Admins can create projects and invite members by email.
3. **Tasks**: Admins create tasks and assign them to members.
4. **Track**: Members can update the status of tasks assigned to them.
5. **Dashboard**: View real-time stats and overdue tasks.

## 🚢 Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Add environment variables (`MONGODB_URI`, `JWT_SECRET`) in the Railway dashboard.
3. The root `package.json` is configured to handle the build process.
