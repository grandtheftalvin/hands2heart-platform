// Test script for bidding payment functionality
const axios = require('axios');

async function testBiddingPayment() {
  console.log('🧪 Testing Bidding Payment Functionality...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthCheck = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running:', healthCheck.data);

    // Test 2: Test payment initiation endpoint
    console.log('\n2. Testing payment initiation endpoint...');
    const testPayment = await axios.post('http://localhost:5000/api/payments/initiate', {
      bid_id: 1,
      phone_number: '254700000000',
      amount: 1000,
      artefact_title: 'Test Artefact'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Payment initiation response:', testPayment.data);

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 This might be due to:');
      console.log('- Missing Daraja environment variables');
      console.log('- Invalid Daraja credentials');
      console.log('- Database connection issues');
    }
  }
}

// Run the test
testBiddingPayment(); 