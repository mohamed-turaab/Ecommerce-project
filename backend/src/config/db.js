const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  const options = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    if (process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB memory server connected: ${conn.connection.host}`);
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Create a .env file and add your MongoDB connection string.');
    }

    while (retries > 0) {
      try {
        console.log(`Connecting to MongoDB... (${retries} attempts left)`);
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        retries -= 1;
        console.error(`MongoDB connection attempt failed. Retries left: ${retries}`);
        if (retries === 0) throw err;
        
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error(`CRITICAL: MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
