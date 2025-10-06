// MongoDB Atlas Setup Helper
// This script helps you set up MongoDB Atlas properly

console.log('🗄️ MongoDB Atlas Setup Helper\n');

console.log('📋 STEP-BY-STEP SETUP:\n');

console.log('1️⃣ CREATE MONGODB ATLAS ACCOUNT:');
console.log('   - Go to https://cloud.mongodb.com');
console.log('   - Sign up for free account');
console.log('   - Choose "Build a Database"');
console.log('');

console.log('2️⃣ CREATE CLUSTER:');
console.log('   - Choose "Shared" (free tier)');
console.log('   - Select region closest to you');
console.log('   - Name your cluster (e.g., "futurepath-cluster")');
console.log('   - Click "Create Cluster"');
console.log('');

console.log('3️⃣ SET UP NETWORK ACCESS:');
console.log('   - Go to "Network Access" in left sidebar');
console.log('   - Click "Add IP Address"');
console.log('   - Choose "Allow Access from Anywhere" (0.0.0.0/0)');
console.log('   - Click "Confirm"');
console.log('');

console.log('4️⃣ CREATE DATABASE USER:');
console.log('   - Go to "Database Access" in left sidebar');
console.log('   - Click "Add New Database User"');
console.log('   - Choose "Password" authentication');
console.log('   - Username: futurepath_user');
console.log('   - Password: your_secure_password');
console.log('   - Database User Privileges: "Read and write to any database"');
console.log('   - Click "Add User"');
console.log('');

console.log('5️⃣ GET CONNECTION STRING:');
console.log('   - Go to "Database" in left sidebar');
console.log('   - Click "Connect" on your cluster');
console.log('   - Choose "Connect your application"');
console.log('   - Select "Node.js" and "3.6 or later"');
console.log('   - Copy the connection string');
console.log('');

console.log('6️⃣ UPDATE CONNECTION STRING:');
console.log('   Replace <password> with your actual password:');
console.log('   mongodb+srv://futurepath_user:<password>@cluster0.xxxxx.mongodb.net/futurepath_ai?retryWrites=true&w=majority');
console.log('');

console.log('7️⃣ TEST CONNECTION:');
console.log('   - Set MONGODB_URI environment variable');
console.log('   - Run: node test-mongodb-connection.js');
console.log('   - Check if connection is successful');
console.log('');

console.log('8️⃣ UPDATE RENDER ENVIRONMENT:');
console.log('   - Go to your Render dashboard');
console.log('   - Select your backend service');
console.log('   - Go to "Environment" tab');
console.log('   - Add MONGODB_URI with your connection string');
console.log('   - Redeploy the service');
console.log('');

console.log('🔧 TROUBLESHOOTING:');
console.log('   - If database not showing: Check if cluster is running');
console.log('   - If connection fails: Check network access settings');
console.log('   - If authentication fails: Check username/password');
console.log('   - If timeout: Check cluster status and network access');
console.log('');

console.log('📚 DOCUMENTATION:');
console.log('   - MongoDB Atlas: https://docs.atlas.mongodb.com/');
console.log('   - Connection Guide: https://docs.atlas.mongodb.com/connect-to-cluster/');
console.log('   - Network Access: https://docs.atlas.mongodb.com/security-whitelist/');
console.log('');

console.log('🎯 NEXT STEPS:');
console.log('   1. Follow the steps above');
console.log('   2. Test your connection locally');
console.log('   3. Update Render environment variables');
console.log('   4. Deploy and test signup functionality');
console.log('');

console.log('💡 TIP: Use the free tier for testing, upgrade later if needed!');
