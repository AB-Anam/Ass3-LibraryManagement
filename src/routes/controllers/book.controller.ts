import { Request, Response } from 'express';
import mongoose from 'mongoose'; // <-- import mongoose to use ObjectId.isValid
import Book from '../../models/book.model';

// Utility to send consistent responses
const sendResponse = (res: Response, status: number, success: boolean, message: string, data: any = null) => {
  res.status(status).json({ success, message, data });
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    await book.save();
    sendResponse(res, 201, true, 'Book created successfully', book);
  } catch (error: any) {
    sendResponse(res, 400, false, 'Validation failed', error);
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;

    const query: any = {};
    if (filter) query.genre = filter;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(Number(limit));

    sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error: any) {
    sendResponse(res, 500, false, 'Server error', error);
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const book = await Book.findById(id);
    if (!book) return sendResponse(res, 404, false, 'Book not found');
    sendResponse(res, 200, true, 'Book retrieved successfully', book);
  } catch (error: any) {
    sendResponse(res, 400, false, 'Invalid book ID', error);
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!book) return sendResponse(res, 404, false, 'Book not found');
    sendResponse(res, 200, true, 'Book updated successfully', book);
  } catch (error: any) {
    sendResponse(res, 400, false, 'Update failed', error);
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const book = await Book.findByIdAndDelete(id);
    if (!book) return sendResponse(res, 404, false, 'Book not found');
    sendResponse(res, 200, true, 'Book deleted successfully', null);
  } catch (error: any) {
    sendResponse(res, 400, false, 'Delete failed', error);
  }
};
