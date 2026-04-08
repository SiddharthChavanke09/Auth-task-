#!/usr/bin/env node

// test-api.js
// Simple script to test the authentication API endpoints
// Usage: node test-api.js

const http = require('http');

const API_URL = 'http://localhost:5000/api';

let tokens = {
  accessToken: null,
  refreshToken: null,
};

// Helper function to make HTTP requests
function makeRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if we have an access token
    if (tokens.accessToken) {
      options.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n📋 Testing Health Check...');
  try {
    const response = await makeRequest('GET', '/health');
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', response.body);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n📋 Testing User Registration...');
  const userData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123',
  };

  try {
    const response = await makeRequest('POST', '/auth/register', userData);
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', response.body);
    return response.status === 201 && response.body.user;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n📋 Testing User Login...');
  const credentials = {
    username: 'testuser',
    password: 'password123',
  };

  try {
    const response = await makeRequest('POST', '/auth/login', credentials);
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', response.body);

    if (response.body.accessToken && response.body.refreshToken) {
      tokens.accessToken = response.body.accessToken;
      tokens.refreshToken = response.body.refreshToken;
      console.log('🔑 Tokens saved for next tests');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testRefreshToken() {
  console.log('\n📋 Testing Token Refresh...');

  if (!tokens.refreshToken) {
    console.log('⚠️ No refresh token available (login first)');
    return false;
  }

  try {
    const response = await makeRequest('POST', '/auth/refresh-token', {
      refreshToken: tokens.refreshToken,
    });
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', response.body);

    if (response.body.accessToken) {
      tokens.accessToken = response.body.accessToken;
      console.log('🔑 New access token obtained');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testLogout() {
  console.log('\n📋 Testing User Logout...');

  if (!tokens.accessToken || !tokens.refreshToken) {
    console.log('⚠️ No tokens available (login first)');
    return false;
  }

  try {
    const response = await makeRequest('POST', '/auth/logout', {
      refreshToken: tokens.refreshToken,
    });
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', response.body);

    tokens.accessToken = null;
    tokens.refreshToken = null;
    console.log('🔑 Tokens cleared');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('=================================');

  const results = {};

  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();

  // Test 2: Register
  results.register = await testRegister();

  // Note: For login test, we need an existing user
  // You should manually create a user first or modify this test
  console.log('\n⚠️  Note: Login test requires an existing user in the database');
  console.log('   Please register a user first or modify the credentials in this script');

  // Test 3: Login (optional, requires existing user)
  // results.login = await testLogin();
  // results.refreshToken = await testRefreshToken();
  // results.logout = await testLogout();

  // Summary
  console.log('\n=================================');
  console.log('📊 Test Summary:');
  console.log('=================================');

  let passed = 0;
  let failed = 0;

  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test}`);
    result ? passed++ : failed++;
  }

  console.log('=================================');
  console.log(`Total: ${passed + failed} tests | Passed: ${passed} | Failed: ${failed}`);

  if (failed === 0) {
    console.log('✨ All tests passed!');
  } else {
    console.log(`⚠️  ${failed} test(s) failed`);
  }

  console.log('\n📖 Next Steps:');
  console.log('1. Import postman-collection.json into Postman for comprehensive testing');
  console.log('2. Check QUICK_START.md for detailed testing instructions');
  console.log('3. Review README.md for API documentation');
}

// Run tests if server is available
async function checkServer() {
  try {
    console.log('🔍 Checking if server is running...');
    await makeRequest('GET', '/health');
    console.log('✅ Server is running!');
    return true;
  } catch (error) {
    console.error('❌ Server is not running!');
    console.error('Please start the server first: npm run dev');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();
