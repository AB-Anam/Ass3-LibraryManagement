import { Request, Response } from 'express';
import Borrow from '../../models/borrow.model';
import Book from '../../models/book.model';

const sendResponse = (res: Response, status: number, success: boolean, message: string, data: any = null) => {
  res.status(status).json({ success, message, data });
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) return sendResponse(res, 404, false, 'Book not found');

    // Check availability
    if (book.copies < quantity) {
      return sendResponse(res, 400, false, 'Not enough copies available');
    }

    // Deduct copies
    book.copies -= quantity;
    book.updateAvailability(); // instance method updates available based on copies

    await book.save();

    // Create borrow record
    const borrowRecord = new Borrow({ book: bookId, quantity, dueDate });
    await borrowRecord.save();

    sendResponse(res, 201, true, 'Book borrowed successfully', borrowRecord);
  } catch (error: any) {
    sendResponse(res, 400, false, 'Borrow failed', error);
  }
};

// Aggregation summary endpoint
export const borrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn'
          },
          totalQuantity: 1
        }
      }
    ]);

    // Reorder keys explicitly:
    const reorderedSummary = summary.map(item => ({
      book: item.book,
      totalQuantity: item.totalQuantity,
    }));

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: reorderedSummary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve summary',
      data: error,
    });
  }
};
