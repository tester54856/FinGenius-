require('dotenv/config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Simple User Schema for seeding
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePicture: String,
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await UserModel.findOne({ email: "dfstevemiller11@gmail.com" });
    
    if (existingUser) {
      console.log("✅ Test user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("miller@123", 10);

    // Create test user
    const testUser = new UserModel({
      name: "Steve Miller",
      email: "dfstevemiller11@gmail.com",
      password: hashedPassword,
    });

    await testUser.save();

    console.log("✅ Test user created successfully");
    console.log("📧 Email: dfstevemiller11@gmail.com");
    console.log("🔑 Password: miller@123");
    
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding user:", error);
    process.exit(1);
  }
};

seedUser(); 