"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Enum for genre types
const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];
// Schema definition
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: genres, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
}, { timestamps: true });
// Instance method: updates availability
bookSchema.methods.updateAvailability = function () {
    this.available = this.copies > 0;
};
// Middleware (post-save) to log creation
bookSchema.post('save', function (doc) {
    console.log(`📘 Book saved: ${doc.title}`);
});
const Book = (0, mongoose_1.model)('Book', bookSchema);
exports.default = Book;
