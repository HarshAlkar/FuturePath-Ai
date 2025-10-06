// Database Connection Test Script
// This script tests the database connection and user operations

import mongoose from 'mongoose';
import User from './models/User.js';

const testDatabaseConnection = async () => {
  console.log('🔍 Testing Database Connection...');
  
  try {
    // Test MongoDB connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/futurepath_ai';
    console.log('MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
    
    // Test database operations
    console.log('\n📊 Testing Database Operations...');
    
    // Count existing users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // Test user creation
    console.log('\n🧪 Testing User Creation...');
    const testUser = {
      email: 'test@example.com',
      phone: '1234567890',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      panNumber: 'ABCDE1234F'
    };
    
    // Check if test user exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('⚠️ Test user already exists, deleting...');
      await User.deleteOne({ email: testUser.email });
    }
    
    // Create new test user
    const newUser = new User(testUser);
    await newUser.save();
    console.log('✅ Test user created successfully');
    
    // Verify user creation
    const createdUser = await User.findOne({ email: testUser.email });
    if (createdUser) {
      console.log('✅ User verification successful');
      console.log('User ID:', createdUser._id);
      console.log('User Email:', createdUser.email);
      console.log('User Name:', createdUser.firstName, createdUser.lastName);
    } else {
      console.log('❌ User verification failed');
    }
    
    // Clean up test user
    await User.deleteOne({ email: testUser.email });
    console.log('✅ Test user cleaned up');
    
    // Test user search
    console.log('\n🔍 Testing User Search...');
    const allUsers = await User.find({}).limit(5);
    console.log('Sample users:', allUsers.map(user => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })));
    
    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run the test
testDatabaseConnection();
