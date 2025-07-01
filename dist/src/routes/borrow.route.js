"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("./controllers/borrow.controller");
const router = express_1.default.Router();
// POST /api/borrow  → router.post('/') 
router.post('/', borrow_controller_1.borrowBook);
// GET /api/borrow  → router.get('/')
router.get('/', borrow_controller_1.borrowedBooksSummary);
exports.default = router;
