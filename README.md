# Coaching Institute Management System

A comprehensive web application for coaching institutes to manage students, attendance, and fees with automated WhatsApp notifications and email reports.

## Features

- **User Management**:
  - Three user roles: Admin, Teacher, and Parent
  - Authentication with JWT
  - Role-based access control

- **Student Management**:
  - Register students through parent accounts
  - Track student information, grades, and enrollment in batches

- **Attendance Tracking**:
  - Mark attendance for each class session
  - Automatic WhatsApp notifications to parents for absent students
  - Monthly attendance reports via email

- **Fee Management**:
  - Create and track fee entries
  - Process payments and generate receipts
  - Email fee receipts to parents

- **Batch/Class Management**:
  - Create and manage different batches/classes
  - Assign teachers to batches
  - Schedule classes with timing information

## Technology Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for UI
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- TypeScript for type safety

### Third-party Integrations
- Twilio API for WhatsApp notifications
- Nodemailer for email reports

## Project Structure

```
coaching-institute-app/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context for state management
│       ├── pages/          # Page components
│       ├── services/       # API service functions
│       └── utils/          # Utility functions
│
└── server/                 # Backend Node.js application
    ├── src/                # Server source code
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Request handlers
    │   ├── middleware/     # Express middleware
    │   ├── models/         # Mongoose models
    │   ├── routes/         # API route definitions
    │   ├── services/       # Business logic
    │   └── utils/          # Utility functions
    └── dist/               # Compiled TypeScript
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Twilio account (for WhatsApp notifications)
- SMTP email provider (for email reports)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/coaching-institute-app.git
   cd coaching-institute-app
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coaching-institute
   JWT_SECRET=your_jwt_secret_key_here
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_SERVICE=gmail
   ```

4. Install client dependencies
   ```
   cd ../client
   npm install
   ```

5. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the server (development mode)
   ```
   cd server
   npm run dev
   ```

2. Start the client
   ```
   cd client
   npm start
   ```

The application will be available at http://localhost:3000.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/batch` - Get attendance by batch and date
- `GET /api/attendance/student` - Get student attendance
- `GET /api/attendance/monthly-report` - Get monthly attendance report

### Fees
- `POST /api/fees` - Create fee entry
- `POST /api/fees/payment` - Record fee payment
- `GET /api/fees/:id` - Get fee details
- `GET /api/fees/student/:studentId` - Get student fees
- `GET /api/fees/receipt/:feeId` - Generate fee receipt
- `GET /api/fees/status/pending` - Get pending fees
- `GET /api/fees/status/overdue` - Get overdue fees

## Deployment

The application can be deployed using:
- Frontend: Vercel, Netlify, or AWS Amplify
- Backend: Render, Railway, Heroku, or AWS EC2

## License

This project is licensed under the MIT License. 