require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('🔍 Testing JWT and environment variables...');

// Check environment variables
const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET", 
  "JWT_REFRESH_SECRET",
  "GEMINI_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY", 
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY"
];

console.log('\n📋 Environment variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
  }
});

// Test JWT signing
try {
  console.log('\n🔍 Testing JWT signing...');
  const payload = { userId: 'test-user-id' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
  
  console.log('✅ JWT token created successfully');
  console.log('Token length:', token.length);
  
  // Test JWT verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ JWT token verified successfully');
  console.log('Decoded payload:', decoded);
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
}

console.log('\n🎉 JWT test completed!'); 