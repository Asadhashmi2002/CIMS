# Coaching Institute Management System

A full-stack application for managing a coaching institute with features for admin and teacher roles, student management, and course/batch organization.

## Features

- User authentication with role-based access control
- Teacher management (CRUD operations)
- Student management
- Batch/class organization
- Attendance tracking
- Fee management
- Reporting

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/coaching-institute-app.git
cd coaching-institute-app
```

2. Install dependencies for both client and server:
```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```
# In /server directory
MONGO_URI=mongodb://localhost:27017/coaching-institute
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Set up the database with initial data:
```
# In /server directory
npm run seed
```

## Running the Application

### Development Mode

1. Start the server:
```
# In /server directory
npm run dev
```

2. Start the client:
```
# In /client directory
npm start
```

The client will be available at http://localhost:3000, and the server will run on http://localhost:5000.

### Production Build

1. Build the client:
```
# In /client directory
npm run build
```

2. Build the server:
```
# In /server directory
npm run build
```

3. Start the production server:
```
# In /server directory
npm start
```

## Default Login Credentials

After running the seed script, you can use these credentials to log in:

- **Admin**:
  - Email: admin@example.com
  - Password: admin123

- **Teacher**:
  - Email: teacher@example.com
  - Password: teacher123

## License

MIT 