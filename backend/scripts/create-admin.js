const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../src/models/User');

dotenv.config();

const admin = {
  name: process.env.ADMIN_NAME || 'Store Admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'Admin12345',
  role: 'admin',
};

const createAdmin = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: admin.email }).select('+password');

    if (existingAdmin) {
      
      existingAdmin.name = admin.name;
      existingAdmin.password = admin.password;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Admin updated: ${admin.email}`);
    } else {
      
      await User.create(admin);
      console.log(`Admin created: ${admin.email}`);
    }

    console.log(`Admin password: ${admin.password}`);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exitCode = 1;
  } finally {
    
    await mongoose.connection.close();
  }
};

createAdmin();
