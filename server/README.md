# BookMyShow Backend Server

Express.js backend with MongoDB integration for the BookMyShow application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure MongoDB is running:**
   - Local MongoDB: `mongodb://127.0.0.1:27017/bookmyshow`
   - Or set `MONGO_URI` environment variable for MongoDB Atlas or custom connection

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## MongoDB Collections

### Movies Collection
Stores movie information:
- `id` (Number, unique)
- `title`, `posterUrl`, `backdropUrl`, `description`
- `cast`, `director`, `genre`, `releaseDate`
- `duration`, `rating`, `language`
- `showtimes` (Array)
- `price` (Number)
- `createdAt`, `updatedAt` (auto-generated)

### Bookings Collection
Stores ticket booking details:
- `movieId` (Number, required)
- `movieTitle` (String, required)
- `showtime` (String, required)
- `seats` (Array of Strings, required)
- `total` (Number, required)
- `user` (Object with name, email, phone - all required)
- `paymentMethod` (String: 'card', 'upi', or 'wallet')
- `paymentDetails` (Object with masked/safe payment info)
- `bookingStatus` (String: 'confirmed' or 'cancelled', default: 'confirmed')
- `createdAt`, `updatedAt` (auto-generated)

## API Endpoints

### GET /api/movies
Get all movies from MongoDB.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Avatar: The Way of Water",
    ...
  }
]
```

### GET /api/movies/:id
Get a specific movie by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Avatar: The Way of Water",
  ...
}
```

### POST /api/bookings
Create a new booking and save to MongoDB.

**Request Body:**
```json
{
  "movieId": 1,
  "showtime": "10:00 AM",
  "seats": ["A1", "A2"],
  "total": 700,
  "paymentMethod": "card",
  "paymentDetails": {
    "cardNumber": "1234567890123456"
  },
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Response:**
```json
{
  "message": "Booking created successfully and saved to MongoDB",
  "booking": {
    "id": "...",
    "movieTitle": "Avatar: The Way of Water",
    "showtime": "10:00 AM",
    "seats": ["A1", "A2"],
    "total": 700,
    "bookingStatus": "confirmed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/bookings
Get all bookings from MongoDB (sorted by creation date, newest first).

**Response:**
```json
[
  {
    "_id": "...",
    "movieId": 1,
    "movieTitle": "Avatar: The Way of Water",
    "showtime": "10:00 AM",
    "seats": ["A1", "A2"],
    "total": 700,
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "paymentMethod": "card",
    "paymentDetails": {
      "last4Digits": "3456"
    },
    "bookingStatus": "confirmed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string (default: `mongodb://127.0.0.1:27017/bookmyshow`)
- `NODE_ENV` - Environment mode ('development' or 'production')

## Security Notes

- Payment details are stored in a masked/safe format:
  - Card numbers: Only last 4 digits stored
  - Wallet numbers: Masked with asterisks
  - Full sensitive data is never stored in the database

