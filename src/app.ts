import cors from "cors";
import express from 'express';
import dotenv from 'dotenv';

import bookRoutes from './routes/book.route';
import borrowRoutes from './routes/borrow.route';

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Optional: Health check
app.get('/', (_, res) => {
  res.send('📚 Library Management API is running');
});

export default app;
