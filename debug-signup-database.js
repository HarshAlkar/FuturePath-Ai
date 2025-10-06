// Comprehensive Signup and Database Debugging Script
// This script tests the complete signup flow and database connectivity

const testSignupAndDatabase = async () => {
  const backendUrl = 'https://futurepath-ai-1.onrender.com';
  
  console.log('🔍 Debugging Signup and Database Connection\n');
  console.log('Backend URL:', backendUrl);
  
  // Test 1: Backend Health Check
  console.log('\n1️⃣ Testing Backend Health...');
  try {
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    console.log('Health Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running');
      console.log('Health Data:', healthData);
    } else {
      console.log('❌ Backend health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    return;
  }
  
  // Test 2: Database Connection Test
  console.log('\n2️⃣ Testing Database Connection...');
  try {
    const dbTestResponse = await fetch(`${backendUrl}/api/test-db`);
    console.log('Database Test Status:', dbTestResponse.status);
    
    if (dbTestResponse.ok) {
      const dbData = await dbTestResponse.json();
      console.log('✅ Database connection successful');
      console.log('Database Info:', dbData);
    } else {
      console.log('⚠️ Database test endpoint not available, trying alternative...');
    }
  } catch (error) {
    console.log('⚠️ Database test failed:', error.message);
  }
  
  // Test 3: Signup with Complete Data
  console.log('\n3️⃣ Testing Signup with Complete Data...');
  const signupData = {
    email: 'harshalkar0504@gmail.com',
    phone: '1234567890',
    password: '12345678',
    firstName: 'Harsh',
    lastName: 'Alkar',
    dateOfBirth: '2001-04-05', // Based on age 23
    panNumber: 'ABCDE1234F'
  };
  
  console.log('Signup Data:', signupData);
  
  try {
    const signupResponse = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });
    
    console.log('Signup Status:', signupResponse.status);
    const signupResult = await signupResponse.text();
    console.log('Signup Response:', signupResult);
    
    if (signupResponse.status === 201) {
      console.log('✅ Signup successful!');
      
      // Test 4: Login with the created account
      console.log('\n4️⃣ Testing Login with Created Account...');
      const loginData = {
        email: 'harshalkar0504@gmail.com',
        password: '12345678'
      };
      
      const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      console.log('Login Status:', loginResponse.status);
      const loginResult = await loginResponse.text();
      console.log('Login Response:', loginResult);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed');
      }
      
    } else if (signupResponse.status === 400) {
      console.log('⚠️ Signup failed - User might already exist');
      
      // Try to login with existing account
      console.log('\n4️⃣ Trying Login with Existing Account...');
      const loginData = {
        email: 'harshalkar0504@gmail.com',
        password: '12345678'
      };
      
      const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      console.log('Login Status:', loginResponse.status);
      const loginResult = await loginResponse.text();
      console.log('Login Response:', loginResult);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful with existing account!');
      } else {
        console.log('❌ Login failed with existing account');
      }
      
    } else {
      console.log('❌ Signup failed with status:', signupResponse.status);
      console.log('Error details:', signupResult);
    }
    
  } catch (error) {
    console.log('❌ Signup request failed:', error.message);
  }
  
  // Test 5: Check User Data in Database
  console.log('\n5️⃣ Testing User Data Retrieval...');
  try {
    const usersResponse = await fetch(`${backendUrl}/api/users`);
    console.log('Users Endpoint Status:', usersResponse.status);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Users endpoint accessible');
      console.log('Users Count:', usersData.length || 'Unknown');
    } else {
      console.log('⚠️ Users endpoint not accessible');
    }
  } catch (error) {
    console.log('⚠️ Users endpoint test failed:', error.message);
  }
};

// Run the comprehensive test
testSignupAndDatabase().catch(console.error);
