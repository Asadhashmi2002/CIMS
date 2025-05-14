import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Teacher from '../models/Teacher';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coaching-institute')
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Teacher.deleteMany({});
    
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
    });
    
    await adminUser.save();
    console.log('Created admin user');

    // Create a teacher user
    const teacherUser = new User({
      name: 'Rajesh Sharma',
      email: 'teacher@example.com',
      password: 'teacher123',
      role: 'teacher',
      phone: '+91 9876543211',
    });
    
    const savedTeacher = await teacherUser.save();
    
    // Create teacher profile
    const teacherProfile = new Teacher({
      userId: savedTeacher._id,
      qualification: 'PhD in Physics',
      specialization: 'Physics',
      experience: 5,
      joiningDate: new Date('2023-01-15'),
    });
    
    await teacherProfile.save();
    console.log('Created teacher');

    console.log('Database seeded successfully!');
    console.log('\n----- Login Credentials -----');
    console.log('Admin Email: admin@example.com');
    console.log('Admin Password: admin123');
    console.log('Teacher Email: teacher@example.com');
    console.log('Teacher Password: teacher123');
    console.log('-----------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  }).catch(err => {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  });
}); 