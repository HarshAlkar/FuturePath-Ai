// Detailed Authentication Test
// This script tests the authentication endpoints with proper data

const testDetailedAuth = async () => {
  const backendUrl = 'https://futurepath-ai-1.onrender.com';
  
  console.log('🔍 Testing Authentication Endpoints with Detailed Error Information\n');
  
  try {
    // Test registration with proper data
    console.log('Testing registration with proper data...');
    const registerData = {
      email: 'test@example.com',
      phone: '1234567890',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      panNumber: 'ABCDE1234F'
    };
    
    const registerResponse = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    console.log('Registration status:', registerResponse.status);
    const registerResult = await registerResponse.text();
    console.log('Registration response:', registerResult);
    
    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
    } else if (registerResponse.status === 400) {
      console.log('⚠️ Registration failed - user might already exist');
    } else {
      console.log('❌ Registration failed with status:', registerResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
  }
  
  try {
    // Test login with proper data
    console.log('\nTesting login with proper data...');
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Login status:', loginResponse.status);
    const loginResult = await loginResponse.text();
    console.log('Login response:', loginResult);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
    } else if (loginResponse.status === 401) {
      console.log('⚠️ Login failed - invalid credentials (expected if user doesn\'t exist)');
    } else {
      console.log('❌ Login failed with status:', loginResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
};

testDetailedAuth();
