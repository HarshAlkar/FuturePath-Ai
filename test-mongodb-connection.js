// Test MongoDB Atlas Connection
// This script tests your MongoDB Atlas connection

import mongoose from 'mongoose';

const testMongoDBConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');
  
  // Your MongoDB Atlas connection string
  // Replace with your actual connection string
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/futurepath_ai?retryWrites=true&w=majority';
  
  console.log('Connection String:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Test database operations
    console.log('\n📊 Testing Database Operations...');
    
    // Create a test collection
    const testSchema = new mongoose.Schema({
      name: String,
      email: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // Insert test document
    const testDoc = new TestModel({
      name: 'Test User',
      email: 'test@example.com'
    });
    
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Query test document
    const foundDoc = await TestModel.findOne({ email: 'test@example.com' });
    if (foundDoc) {
      console.log('✅ Test document retrieved successfully');
      console.log('Document:', foundDoc);
    }
    
    // Count documents
    const count = await TestModel.countDocuments();
    console.log('✅ Total documents in test collection:', count);
    
    // Clean up test document
    await TestModel.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test document cleaned up');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Available collections:', collections.map(c => c.name));
    
    console.log('\n🎉 MongoDB Atlas connection test successful!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    // Provide specific error solutions
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 SOLUTION: Authentication Failed');
      console.log('1. Check your username and password');
      console.log('2. Make sure the database user exists in MongoDB Atlas');
      console.log('3. Verify the user has read/write permissions');
    }
    
    if (error.message.includes('network')) {
      console.log('\n🔧 SOLUTION: Network Access Issue');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Add IP Address: 0.0.0.0/0 (allow all IPs)');
      console.log('3. Or add your Render server IPs specifically');
    }
    
    if (error.message.includes('cluster')) {
      console.log('\n🔧 SOLUTION: Cluster Issue');
      console.log('1. Check if your cluster is running (not paused)');
      console.log('2. Resume the cluster if it\'s paused');
      console.log('3. Verify the cluster URL is correct');
    }
    
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
};

// Run the test
testMongoDBConnection();
