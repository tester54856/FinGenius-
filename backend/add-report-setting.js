const mongoose = require('mongoose');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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
    default: 1, // Monday
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

async function addReportSetting() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the test user
    const user = await User.findOne({ email: 'drstevemiller11@gmail.com' });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('✅ Found test user:', user.name);

    // Check if report setting already exists
    const existingSetting = await ReportSetting.findOne({ userId: user._id });
    
    if (existingSetting) {
      console.log('✅ Report setting already exists');
      return;
    }

    // Create report setting
    const reportSetting = new ReportSetting({
      userId: user._id,
      frequency: "weekly",
      dayOfWeek: 1, // Monday
      dayOfMonth: 1,
      time: "09:00",
      isEnabled: true
    });

    await reportSetting.save();
    console.log('✅ Report setting created successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

addReportSetting(); 