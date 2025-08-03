require('dotenv').config();
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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

const User = mongoose.model('User', userSchema);
const ReportSetting = mongoose.model('ReportSetting', reportSettingSchema);

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test user query
    console.log('\n🔍 Testing user query...');
    const user = await User.findOne({ email: 'drstevemiller11@gmail.com' });
    
    if (user) {
      console.log('✅ User found:', user.name);
      console.log('User ID:', user._id);
      console.log('Has password:', !!user.password);
    } else {
      console.log('❌ User not found');
    }

    // Test report setting query
    console.log('\n🔍 Testing report setting query...');
    if (user) {
      const reportSetting = await ReportSetting.findOne({ userId: user._id });
      if (reportSetting) {
        console.log('✅ Report setting found');
        console.log('Frequency:', reportSetting.frequency);
        console.log('Is Enabled:', reportSetting.isEnabled);
      } else {
        console.log('❌ Report setting not found');
      }
    }

    // Test password comparison
    if (user) {
      console.log('\n🔍 Testing password comparison...');
      const bcrypt = require('bcrypt');
      const isPasswordValid = await bcrypt.compare('miller@123', user.password);
      console.log('Password valid:', isPasswordValid);
    }

    console.log('\n🎉 Database test completed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testDatabase(); 