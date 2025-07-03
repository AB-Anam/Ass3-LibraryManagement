📚 Library Management System – Backend API
A Node.js + Express.js powered RESTful API for managing a simple library system. This application allows administrators to manage books, track borrow activities, monitor availability, and generate summaries through a clean and scalable backend. MongoDB is used as the database with Mongoose for modeling. 'npm run dev'

🚀 Features
✅ Add, update, delete, and view books

✅ Borrow books with due date tracking

✅ Dynamic availability updates via instance method

✅ MongoDB aggregation pipeline to generate borrow summaries

✅ Schema validation using Mongoose

✅ Business logic enforcement (availability control, validations)

✅ Use of Mongoose instance method: updateAvailability()

✅ Mongoose middleware (post-save log for books)

✅ Filtering and projection in aggregation

✅ Well-structured MVC architecture

✅ .env environment variable support for configuration

🧠 Tech Stack
Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Runtime: ts-node-dev (TypeScript)

Environment Config: dotenv

📂 Folder Structure Overview
bash
Copy
Edit
src/
├── controllers/      # Business logic
├── models/           # Mongoose models & schemas
├── routes/           # Express route handlers
├── config/           # Database connection setup
├── app.ts            # Express app setup & middleware
├── server.ts         # Entry point and server listener
└── .env              # Environment variables
🛠️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/library-management-api.git
cd library-management-api
2. Install Dependencies
bash
Copy
Edit
npm install
3. Create .env File
In the root folder, create a .env file and add the following:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
PORT=3000
Replace your_mongodb_connection_string with your actual MongoDB URI.

4. Start the Server
bash
Copy
Edit
npm run dev
Your server will run at: http://localhost:3000

📬 API Endpoints
Books
POST /api/books – Add new book

GET /api/books – Get all books

GET /api/books/:id – Get book by ID

PUT /api/books/:id – Update book

DELETE /api/books/:id – Delete book

Borrow
POST /api/borrow – Borrow book

GET /api/borrow – Borrowed books summary (with aggregation)

✅ Instance Method Used
updateAvailability() – This Mongoose instance method updates the available status of a book based on its remaining copies.

🔄 Mongoose Middleware
bookSchema.post('save') – Logs a message every time a book is saved. Helpful for monitoring and debugging.

📦 Future Improvements
Add authentication (JWT)

Add user roles (admin/user)

Frontend integration (React or Next.js)

Return book feature

Pagination and search

🧑‍💻 Author
Developed by [Your Name] – a simple but complete backend system to explore Node.js, Express, and MongoDB with real-life logic and Mongoose features.
