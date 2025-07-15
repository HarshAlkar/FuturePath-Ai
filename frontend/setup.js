import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up FinPilot Backend...\n');

// Check if backend directory exists
if (!fs.existsSync('backend')) {
  console.error('❌ Backend directory not found!');
  process.exit(1);
}

try {
  // Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { cwd: 'backend', stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully!\n');

  // Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully!\n');

  console.log('🎉 Setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Start the backend server:');
  console.log('   cd backend && npm run dev');
  console.log('');
  console.log('2. In a new terminal, start the frontend:');
  console.log('   npm run dev');
  console.log('');
  console.log('3. Open your browser and navigate to:');
  console.log('   http://localhost:5173');
  console.log('');
  console.log('🔧 Backend will be running on: http://localhost:5000');
  console.log('🌐 Frontend will be running on: http://localhost:5173');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
} 