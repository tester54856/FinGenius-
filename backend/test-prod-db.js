require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing production database connection...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Missing');

async function testProductionDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Database collections:', collections.map(c => c.name));

    // Test user query
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String
    }));

    const user = await User.findOne({ email: 'drstevemiller11@gmail.com' });
    console.log('✅ User query result:', user ? 'Found' : 'Not found');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testProductionDB(); 