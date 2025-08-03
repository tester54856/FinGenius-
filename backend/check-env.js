require('dotenv').config();

console.log('🔍 Checking environment variables...');

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

console.log('\n📋 Required variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
  }
});

console.log('\n🔧 Other variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`FRONTEND_ORIGIN: ${process.env.FRONTEND_ORIGIN}`); 