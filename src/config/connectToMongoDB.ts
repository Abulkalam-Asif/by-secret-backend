const mongoose = require("mongoose");

export default async function connectToMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  try {
    // Allow for flexible MongoDB connection string from environment variable
    const connectionString = process.env.MONGODB_URI;

    // Removed deprecated options
    const conn = await mongoose.connect(connectionString);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}
