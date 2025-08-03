const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User Schema (matching the actual model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add methods to match the actual model
userSchema.methods.omitPassword = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

async function addTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'drstevemiller11@gmail.com' });
    
    if (existingUser) {
      console.log('✅ User already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('miller@123', 10);
    
    // Create user with correct schema
    const user = new User({
      name: 'Test User',
      email: 'drstevemiller11@gmail.com',
      password: hashedPassword,
      profilePicture: null
    });

    await user.save();
    console.log('✅ Test user created successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

addTestUser(); 