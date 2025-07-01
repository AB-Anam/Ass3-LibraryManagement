import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

import bookRoutes from './routes/book.route';
import borrowRoutes from './routes/borrow.route'; 

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/api/books', bookRoutes);     // /api/books/...
app.use('/api/borrow', borrowRoutes);  // /api/borrow/...

app.get('/', (req, res) => {
  res.send('Library Management API is running');
});

export default app;