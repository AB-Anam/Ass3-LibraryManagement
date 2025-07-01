"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowedBooksSummary = exports.borrowBook = void 0;
const borrow_model_1 = __importDefault(require("../../models/borrow.model"));
const book_model_1 = __importDefault(require("../../models/book.model"));
const sendResponse = (res, status, success, message, data = null) => {
    res.status(status).json({ success, message, data });
};
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        // Find the book
        const book = yield book_model_1.default.findById(bookId);
        if (!book)
            return sendResponse(res, 404, false, 'Book not found');
        // Check availability
        if (book.copies < quantity) {
            return sendResponse(res, 400, false, 'Not enough copies available');
        }
        // Deduct copies
        book.copies -= quantity;
        book.updateAvailability(); // instance method updates available based on copies
        yield book.save();
        // Create borrow record
        const borrowRecord = new borrow_model_1.default({ book: bookId, quantity, dueDate });
        yield borrowRecord.save();
        sendResponse(res, 201, true, 'Book borrowed successfully', borrowRecord);
    }
    catch (error) {
        sendResponse(res, 400, false, 'Borrow failed', error);
    }
});
exports.borrowBook = borrowBook;
// Aggregation summary endpoint
const borrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve summary',
            data: error,
        });
    }
});
exports.borrowedBooksSummary = borrowedBooksSummary;
