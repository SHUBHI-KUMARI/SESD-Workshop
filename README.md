# Book Inventory API

A full-fledged CRUD backend API for Book Inventory Management built with Node.js, Express, and TypeScript following OOP principles.

## Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete books
- ✅ **Search** - Full-text search across title, author, ISBN, genre
- ✅ **Filtering** - Filter by genre, author, price range, year range
- ✅ **Sorting** - Sort by any field (ascending/descending)
- ✅ **Pagination** - Paginated results with metadata
- ✅ **Validation** - Comprehensive input validation with clear error messages
- ✅ **Authentication** - JWT-based authentication
- ✅ **Authorization** - Role-based access control (admin/user)
- ✅ **Error Handling** - Centralized error handling with proper HTTP status codes

## Architecture

The project follows a clean OOP architecture:

```
src/
├── controllers/     # Handle HTTP requests/responses
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── models/          # Data models/entities
├── interfaces/      # TypeScript interfaces
├── middlewares/     # Express middlewares
├── routes/          # API route definitions
├── utils/           # Utilities and helpers
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/SHUBHI-KUMARI/SESD-Workshop.git
cd SESD-Workshop
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

### Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Books

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Get all books (with filters) | No |
| GET | `/api/books/:id` | Get a single book | No |
| POST | `/api/books` | Create a new book | Yes (Admin) |
| PUT | `/api/books/:id` | Update a book | Yes (Admin) |
| DELETE | `/api/books/:id` | Delete a book | Yes (Admin) |

### Query Parameters for GET /api/books

| Parameter | Description | Example |
|-----------|-------------|---------|
| `search` | Search in title, author, ISBN, genre | `?search=javascript` |
| `genre` | Filter by genre | `?genre=fiction` |
| `author` | Filter by author | `?author=smith` |
| `minPrice` | Minimum price filter | `?minPrice=10` |
| `maxPrice` | Maximum price filter | `?maxPrice=50` |
| `minYear` | Minimum published year | `?minYear=2000` |
| `maxYear` | Maximum published year | `?maxYear=2024` |
| `sortBy` | Sort by field | `?sortBy=price` |
| `sortOrder` | Sort order (asc/desc) | `?sortOrder=asc` |
| `page` | Page number | `?page=1` |
| `limit` | Items per page (max 100) | `?limit=10` |

## Example Requests

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Create Book (Admin only)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "genre": "Programming",
    "publishedYear": 2008,
    "price": 39.99,
    "quantity": 100,
    "description": "A Handbook of Agile Software Craftsmanship"
  }'
```

### Get Books with Filters
```bash
curl "http://localhost:3000/api/books?genre=Programming&sortBy=price&sortOrder=asc&page=1&limit=10"
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **uuid** - Unique ID generation
- **dotenv** - Environment configuration

## License

ISC
