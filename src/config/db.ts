import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

console.log("🔍 MONGO_URI is:", MONGO_URI);

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;

