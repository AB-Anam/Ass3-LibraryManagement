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
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const mongoose_1 = __importDefault(require("mongoose")); // <-- import mongoose to use ObjectId.isValid
const book_model_1 = __importDefault(require("../../models/book.model"));
// Utility to send consistent responses
const sendResponse = (res, status, success, message, data = null) => {
    res.status(status).json({ success, message, data });
};
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new book_model_1.default(req.body);
        yield book.save();
        sendResponse(res, 201, true, 'Book created successfully', book);
    }
    catch (error) {
        sendResponse(res, 400, false, 'Validation failed', error);
    }
});
exports.createBook = createBook;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;
        const query = {};
        if (filter)
            query.genre = filter;
        const books = yield book_model_1.default.find(query)
            .sort({ [sortBy]: sort === 'asc' ? 1 : -1 })
            .limit(Number(limit));
        sendResponse(res, 200, true, 'Books retrieved successfully', books);
    }
    catch (error) {
        sendResponse(res, 500, false, 'Server error', error);
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if bookId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, 'Invalid book ID');
        }
        const book = yield book_model_1.default.findById(id);
        if (!book)
            return sendResponse(res, 404, false, 'Book not found');
        sendResponse(res, 200, true, 'Book retrieved successfully', book);
    }
    catch (error) {
        sendResponse(res, 400, false, 'Invalid book ID', error);
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, 'Invalid book ID');
        }
        const book = yield book_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!book)
            return sendResponse(res, 404, false, 'Book not found');
        sendResponse(res, 200, true, 'Book updated successfully', book);
    }
    catch (error) {
        sendResponse(res, 400, false, 'Update failed', error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, 'Invalid book ID');
        }
        const book = yield book_model_1.default.findByIdAndDelete(id);
        if (!book)
            return sendResponse(res, 404, false, 'Book not found');
        sendResponse(res, 200, true, 'Book deleted successfully', null);
    }
    catch (error) {
        sendResponse(res, 400, false, 'Delete failed', error);
    }
});
exports.deleteBook = deleteBook;
