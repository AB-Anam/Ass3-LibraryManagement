//book.controller.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/book.model';
import connectDB from '../config/db'; // ✅ Added

// ✅ Reusable JSON response helper
const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  res.status(status).json({ success, message, data });
};

// ✅ Create a new book
// ✅ Create a new book
export const createBook = async (req: Request, res: Response) => {
  try {
    await connectDB(); // ensure DB connection

    const book = new Book(req.body);
    await book.save();

    sendResponse(res, 201, true, "Book created successfully", book);
  } catch (error: any) {
    // ✅ Only log concise info to keep backend clean
    console.error("Error creating book:", error.message);

    // ✅ Handle duplicate ISBN error (E11000)
    if (error.code === 11000 && error.keyPattern?.isbn) {
      return sendResponse(res, 400, false, "Duplicate! A book with this ISBN already exists.");
    }

    // ✅ Handle other errors gracefully
    return sendResponse(res, 400, false, "Validation failed", error.message);
  }
};


// ✅ Get all books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    await connectDB(); // ✅ Ensures DB is connected
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;

    const query: any = {};
    if (filter) query.genre = filter;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(Number(limit));

    sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error: any) {
    console.error('Error fetching books:', error);
    sendResponse(res, 500, false, 'Server error', error.message);
  }
};

// ✅ Get a single book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    await connectDB(); // ✅ Ensures DB is connected
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const book = await Book.findById(id);
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    sendResponse(res, 200, true, 'Book retrieved successfully', book);
  } catch (error: any) {
    console.error('Error fetching book by ID:', error);
    sendResponse(res, 500, false, 'Server error', error.message);
  }
};

// ✅ Update a book by ID
export const updateBook = async (req: Request, res: Response) => {
  try {
    await connectDB(); // ✅ Ensures DB is connected
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    sendResponse(res, 200, true, 'Book updated successfully', updatedBook);
  } catch (error: any) {
    console.error('Error updating book:', error);
    sendResponse(res, 400, false, 'Update failed', error.message);
  }
};

// ✅ Delete a book by ID
export const deleteBook = async (req: Request, res: Response) => {
  try {
    await connectDB(); // ✅ Ensures DB is connected
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid book ID');
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    sendResponse(res, 200, true, 'Book deleted successfully');
  } catch (error: any) {
    console.error('Error deleting book:', error);
    sendResponse(res, 400, false, 'Delete failed', error.message);
  }
};
