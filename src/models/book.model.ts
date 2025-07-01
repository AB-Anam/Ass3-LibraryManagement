import { Schema, model, Document, Model } from 'mongoose';

// Enum for genre types
const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] as const;
type Genre = typeof genres[number];

// Book Type
interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  updateAvailability(): void; // Instance method
}

// Schema definition
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: genres, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Instance method: updates availability
bookSchema.methods.updateAvailability = function () {
  this.available = this.copies > 0;
};

// Middleware (post-save) to log creation
bookSchema.post('save', function (doc) {
  console.log(`📘 Book saved: ${doc.title}`);
});

const Book: Model<IBook> = model<IBook>('Book', bookSchema);

export default Book;