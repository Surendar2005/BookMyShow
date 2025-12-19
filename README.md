# BookMyShow - Movie Booking Application

A modern, full-featured movie booking application built with React.js. This application allows users to browse movies, view details, and book tickets with seat selection.

## Features

- 🎬 **Movie Listing**: Browse through a collection of popular movies
- 🔍 **Search Functionality**: Search movies by title or genre
- 📱 **Movie Details**: View comprehensive information about each movie including cast, director, ratings, and showtimes
- 🎫 **Ticket Booking**: Complete booking flow with:
  - Showtime selection
  - Interactive seat selection (Regular and Premium seats)
  - Booking form with user details
  - Price calculation
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technologies Used

- React 18.2.0
- React Router DOM 6.8.0
- CSS3 (Modern styling with gradients and animations)

## Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
npm install
```

2. **Install and Start MongoDB:**
   - **Option 1: Local MongoDB**
     - Install MongoDB from https://www.mongodb.com/try/download/community
     - Start MongoDB service (usually runs automatically on Windows)
     - Default connection: `mongodb://127.0.0.1:27017/bookmyshow`
   
   - **Option 2: MongoDB Atlas (Cloud)**
     - Create a free account at https://www.mongodb.com/cloud/atlas
     - Create a cluster and get your connection string
     - Set environment variable: `MONGO_URI=your_atlas_connection_string`

## Running the Application

### 1. Start the Backend Server

In a terminal, navigate to the server folder:
```bash
cd server
npm start
```

The backend will start on `http://localhost:5000` and connect to MongoDB. On first run, it will automatically seed the database with sample movies.

### 2. Start the Frontend

In another terminal, from the project root:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

**Note:** Both servers must be running for the application to work properly.

## Project Structure

```
BookMyShow/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation header
│   │   ├── Header.css
│   │   ├── Footer.js          # Footer component
│   │   └── Footer.css
│   ├── pages/
│   │   ├── HomePage.js        # Movie listing page
│   │   ├── HomePage.css
│   │   ├── MovieDetailsPage.js # Movie details page
│   │   ├── MovieDetailsPage.css
│   │   ├── BookingPage.js     # Ticket booking page
│   │   └── BookingPage.css
│   ├── data/
│   │   └── movies.js          # Movie data
│   ├── App.js                 # Main app component with routing
│   ├── App.css
│   ├── index.js               # Entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## Usage

1. **Browse Movies**: On the home page, you can see all available movies. Use the search bar to filter movies.

2. **View Details**: Click on any movie card to view detailed information including:
   - Movie description
   - Cast and crew
   - Ratings and duration
   - Available showtimes

3. **Book Tickets**: 
   - Click "Book Tickets" on the movie details page
   - Select a showtime
   - Choose your seats (click on available seats)
   - Fill in your booking details
   - Confirm your booking

## Features in Detail

### Seat Selection
- **Regular Seats**: Standard pricing
- **Premium Seats**: Center seats with higher pricing
- Visual indicators for available, selected, and occupied seats
- Real-time price calculation

### Database Integration
- **MongoDB** stores all movie and booking data
- Bookings are permanently saved with:
  - User details (name, email, phone)
  - Movie and showtime information
  - Selected seats
  - Payment method (Card/UPI/Wallet)
  - Total amount
  - Booking status and timestamps
- Payment details are stored securely (masked card numbers, safe payment info)

### Movie Data
The application includes sample movie data stored in MongoDB with:
- Movie posters
- Detailed descriptions
- Cast information
- Multiple showtimes
- Pricing information

## Customization

You can easily customize the application by:
- Adding more movies in `src/data/movies.js`
- Modifying colors and styles in the CSS files
- Adding new features like user authentication
- Integrating with a backend API

## Build for Production

To create a production build:
```bash
npm run build
```

The build folder will contain the optimized production build.

## License

This project is open source and available for educational purposes.

---

Enjoy booking your favorite movies! 🎬🎟️


