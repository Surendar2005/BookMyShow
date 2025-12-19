const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
// Try 127.0.0.1 if localhost doesn't work on Windows
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmyshow';

app.use(cors());
app.use(express.json());

// Booking Schema - Only bookings are stored in MongoDB
const bookingSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    movieTitle: { type: String, required: true },
    showtime: { type: String, required: true },
    seats: { type: [String], required: true },
    total: { type: Number, required: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, enum: ['card', 'upi', 'wallet'] },
    paymentDetails: {
      // Store masked/safe payment info only (not full card numbers for security)
      last4Digits: String, // For card: last 4 digits only
      upiId: String, // For UPI
      walletProvider: String, // For wallet
      walletNumber: String, // Masked wallet number
    },
    bookingStatus: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

// Routes - Only booking endpoints (movies are in frontend)

app.post('/api/bookings', async (req, res) => {
  const { movieId, showtime, seats, total, user, paymentMethod, paymentDetails } = req.body;

  // Validate required fields
  if (!movieId || !showtime || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Invalid booking data: missing required fields' });
  }

  if (!user || !user.name || !user.email || !user.phone) {
    return res.status(400).json({ message: 'Invalid booking data: user details required' });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Invalid booking data: payment method required' });
  }

  try {
    // Note: Movie data is in frontend, we just need movieId and movieTitle from request
    // The frontend should send movieTitle along with movieId
    const { movieTitle } = req.body;
    
    if (!movieTitle) {
      return res.status(400).json({ message: 'Movie title is required' });
    }

    // Prepare payment details (store only safe/masked information)
    const safePaymentDetails = {};
    if (paymentMethod === 'card' && paymentDetails?.cardNumber) {
      // Store only last 4 digits for security
      const cardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
      safePaymentDetails.last4Digits = cardNumber.slice(-4);
    } else if (paymentMethod === 'upi' && paymentDetails?.upiId) {
      safePaymentDetails.upiId = paymentDetails.upiId;
    } else if (paymentMethod === 'wallet') {
      if (paymentDetails?.walletProvider) {
        safePaymentDetails.walletProvider = paymentDetails.walletProvider;
      }
      if (paymentDetails?.walletNumber) {
        // Mask wallet number (show only last 4 digits)
        const walletNum = paymentDetails.walletNumber.replace(/\s/g, '');
        safePaymentDetails.walletNumber = walletNum.length > 4 
          ? '****' + walletNum.slice(-4) 
          : '****';
      }
    }

    const booking = await Booking.create({
      movieId: Number(movieId),
      movieTitle: movieTitle,
      showtime,
      seats,
      total,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      paymentMethod,
      paymentDetails: safePaymentDetails,
      bookingStatus: 'confirmed',
    });

    console.log('Booking saved to MongoDB:', {
      id: booking._id,
      movie: booking.movieTitle,
      user: booking.user.email,
      total: booking.total,
    });

    res.status(201).json({
      message: 'Booking created successfully and saved to MongoDB',
      booking: {
        id: booking._id,
        movieTitle: booking.movieTitle,
        showtime: booking.showtime,
        seats: booking.seats,
        total: booking.total,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ 
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

app.get('/', (req, res) => {
  res.send('BookMyShow backend is running - Booking API only (movies are in frontend)');
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    console.log('Backend ready - Only booking endpoints available (movies are in frontend)');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

