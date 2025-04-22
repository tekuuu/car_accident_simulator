const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection successful!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

testConnection();