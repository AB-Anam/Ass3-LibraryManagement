"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const borrow_route_1 = __importDefault(require("./routes/borrow.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
app.use('/api/books', book_route_1.default); // /api/books/...
app.use('/api/borrow', borrow_route_1.default); // /api/borrow/...
exports.default = app;
