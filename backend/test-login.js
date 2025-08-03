require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import the actual models
const UserModel = require('./src/models/user.model').default;
const ReportSettingModel = require('./src/models/report-setting.model').default;

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test login data
    const loginData = {
      email: 'drstevemiller11@gmail.com',
      password: 'miller@123'
    };

    console.log('🔍 Testing login for:', loginData.email);

    // Find user
    const user = await UserModel.findOne({ email: loginData.email });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.name);

    // Check password
    const isPasswordValid = await user.comparePassword(loginData.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return;
    }

    console.log('✅ Password is valid');

    // Check report setting
    const reportSetting = await ReportSettingModel.findOne(
      { userId: user.id },
      { _id: 1, frequency: 1, isEnabled: 1 }
    ).lean();

    console.log('✅ Report setting found:', reportSetting);

    console.log('🎉 Login test successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testLogin(); 