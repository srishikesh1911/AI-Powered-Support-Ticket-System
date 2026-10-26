const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // Fallback to in-memory MongoDB if local URI is used and it's missing (for demo purposes)
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      try {
        // Try connecting to the real local mongodb first, but with a short timeout
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected (Local/Real): ${mongoose.connection.host}`);
        return; // Success
      } catch (err) {
        console.log('Local MongoDB not found. Starting in-memory MongoDB...');
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (In-Memory/Cloud): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
