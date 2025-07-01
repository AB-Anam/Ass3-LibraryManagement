import express from 'express';
import {
  borrowBook,
  borrowedBooksSummary,
} from '../controllers/borrow.controller';

const router = express.Router();

// POST /api/borrow  → router.post('/') 
router.post('/', borrowBook);         

// GET /api/borrow  → router.get('/')
router.get('/', borrowedBooksSummary);

export default router;
