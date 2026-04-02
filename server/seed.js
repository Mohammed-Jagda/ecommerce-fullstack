require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Delete existing admin if any
    await User.deleteMany({ role: 'admin' });

    // Create fresh admin
    await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');
    process.exit();
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();