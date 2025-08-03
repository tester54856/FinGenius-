require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Schema with methods
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.omitPassword = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// ReportSetting Schema
const reportSettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly",
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    default: 1,
  },
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31,
    default: 1,
  },
  time: {
    type: String,
    default: "09:00",
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ReportSetting = mongoose.model('ReportSetting', reportSettingSchema);

async function testLoginProcess() {
  try {
    console.log('🔍 Testing login process step by step...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'drstevemiller11@gmail.com';
    const password = 'miller@123';

    console.log(`\n1. Finding user: ${email}`);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    console.log('✅ User found:', user.name);

    console.log('\n2. Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return;
    }
    console.log('✅ Password is valid');

    console.log('\n3. Creating JWT token...');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
    console.log('✅ JWT token created');

    console.log('\n4. Finding report setting...');
    const reportSetting = await ReportSetting.findOne(
      { userId: user.id },
      { _id: 1, frequency: 1, isEnabled: 1 }
    ).lean();
    console.log('✅ Report setting found:', reportSetting ? 'Yes' : 'No');

    console.log('\n5. Creating response object...');
    const response = {
      user: user.omitPassword(),
      accessToken: token,
      expiresAt: jwt.decode(token).exp * 1000,
      reportSetting,
    };
    console.log('✅ Response object created');

    console.log('\n🎉 Login process completed successfully!');
    console.log('User ID:', user.id);
    console.log('Token length:', token.length);
    
  } catch (error) {
    console.error('❌ Login process failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testLoginProcess(); 