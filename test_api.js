const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
};

const testPlan = {
  name: 'Test Plan',
  description: 'A test subscription plan',
  price: 19.99,
  currency: 'USD',
  duration: 30,
  features: ['Feature 1', 'Feature 2'],
  maxUsers: 10,
  apiCallsLimit: 5000
};

let authToken = '';
let userId = '';
let planId = '';

async function testAPI() {
  try {
    console.log('🚀 Starting API Tests...\n');

    // Test 1: Register User
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('✅ User registered successfully');
    console.log('User ID:', registerResponse.data.data.user.id);
    authToken = registerResponse.data.data.token;
    userId = registerResponse.data.data.user.id;
    console.log('Auth Token:', authToken.substring(0, 20) + '...\n');

    // Test 2: Login User
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully');
    authToken = loginResponse.data.data.token;
    console.log('New Auth Token:', authToken.substring(0, 20) + '...\n');

    // Test 3: Get User Profile
    console.log('3. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('Profile:', profileResponse.data.data.firstName, profileResponse.data.data.lastName, '\n');

    // Test 4: Create Plan
    console.log('4. Testing Create Plan...');
    const planResponse = await axios.post(`${BASE_URL}/plans`, testPlan, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Plan created successfully');
    planId = planResponse.data.data.id;
    console.log('Plan ID:', planId, '\n');

    // Test 5: Get All Plans
    console.log('5. Testing Get All Plans...');
    const plansResponse = await axios.get(`${BASE_URL}/plans`);
    console.log('✅ Plans retrieved successfully');
    console.log('Total plans:', plansResponse.data.data.length, '\n');

    // Test 6: Get Active Plans
    console.log('6. Testing Get Active Plans...');
    const activePlansResponse = await axios.get(`${BASE_URL}/plans/active`);
    console.log('✅ Active plans retrieved successfully');
    console.log('Active plans:', activePlansResponse.data.data.length, '\n');

    // Test 7: Create Subscription
    console.log('7. Testing Create Subscription...');
    const subscriptionData = {
      userId: userId,
      planId: planId,
      autoRenew: true,
      paymentMethod: 'credit_card'
    };
    const subscriptionResponse = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Subscription created successfully');
    console.log('Subscription ID:', subscriptionResponse.data.data.id, '\n');

    // Test 8: Get Current User's Subscription
    console.log('8. Testing Get Current User Subscription...');
    const mySubscriptionResponse = await axios.get(`${BASE_URL}/subscriptions/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current subscription retrieved successfully');
    console.log('Subscription Status:', mySubscriptionResponse.data.data.status, '\n');

    // Test 9: Update Subscription
    console.log('9. Testing Update Subscription...');
    const updateData = {
      autoRenew: false,
      metadata: { source: 'api_test' }
    };
    const updateResponse = await axios.put(`${BASE_URL}/subscriptions/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Subscription updated successfully');
    console.log('Auto Renew:', updateResponse.data.data.autoRenew, '\n');

    // Test 10: Health Check
    console.log('10. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed');
    console.log('Status:', healthResponse.data.status, '\n');

    // Test 11: API Documentation
    console.log('11. Testing API Documentation...');
    const docsResponse = await axios.get(`${BASE_URL}/../docs`);
    console.log('✅ API documentation retrieved');
    console.log('API Title:', docsResponse.data.title, '\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Validation errors:', error.response.data.details);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 