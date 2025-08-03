import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { getEnv } from './get-env';

// Test user data
const testUser = {
  email: 'drstevemiller11@gmail.com',
  password: 'miller@123',
  name: 'Dr. Steve Miller',
};

// Seed function
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    const mongoUri = getEnv('MONGO_URI');
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('ℹ️ Test user already exists, skipping...');
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUser.password, saltRounds);

    // Create test user
    const newUser = new UserModel({
      ...testUser,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
} 