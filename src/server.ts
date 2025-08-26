import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/db';  // your mongoose connection helper



const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();  // connects with Mongoose
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();