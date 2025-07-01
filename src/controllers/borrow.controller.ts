import { Request, Response } from 'express';
import Borrow from '../models/borrow.model';  // Adjust path as needed
import Book from '../models/book.model';
import connectDB from '../config/db'; // <-- Added

const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  res.status(status).json({ success, message, data });
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connected before query

    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    if (book.copies < quantity) {
      return sendResponse(res, 400, false, 'Not enough copies available');
    }

    book.copies -= quantity;
    if (typeof book.updateAvailability === 'function') {
      book.updateAvailability(); // Make sure this method exists on the model instance
    }
    await book.save();

    const borrowRecord = new Borrow({ book: bookId, quantity, dueDate });
    await borrowRecord.save();

    sendResponse(res, 201, true, 'Book borrowed successfully', borrowRecord);
  } catch (error: any) {
    console.error('Error borrowing book:', error);
    sendResponse(res, 400, false, 'Borrow failed', error.message);
  }
};

export const borrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connected before aggregation

    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    const reorderedSummary = summary.map((item) => ({
      book: item.book,
      totalQuantity: item.totalQuantity,
    }));

    sendResponse(res, 200, true, 'Borrowed books summary retrieved successfully', reorderedSummary);
  } catch (error: any) {
    console.error('Error retrieving borrowed books summary:', error);
    sendResponse(res, 500, false, 'Failed to retrieve summary', error.message);
  }
};
