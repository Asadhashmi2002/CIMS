import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Teacher from './models/Teacher';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coaching-institute';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Teacher.deleteMany({});
    
    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    
    // Create teacher user
    console.log('Creating teacher user and profile...');
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = new User({
      email: 'teacher@example.com',
      password: teacherPassword,
      role: 'teacher'
    });
    await teacher.save();
    
    // Create teacher profile
    const teacherProfile = new Teacher({
      name: 'John Smith',
      phone: '+91 9876543210',
      subject: 'Mathematics',
      joiningDate: new Date(),
      status: 'active',
      user: teacher._id
    });
    await teacherProfile.save();
    
    console.log('Database seeded successfully!');
    console.log('Admin login: admin@example.com / admin123');
    console.log('Teacher login: teacher@example.com / teacher123');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 