require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

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
      last4Digits: String,
      upiId: String,
      walletProvider: String,
      walletNumber: String,
    },
    bookingStatus: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);


app.post('/api/bookings', async (req, res) => {
  const { movieId, showtime, seats, total, user, paymentMethod, paymentDetails } = req.body;

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
    const { movieTitle } = req.body;
    
    if (!movieTitle) {
      return res.status(400).json({ message: 'Movie title is required' });
    }

    const safePaymentDetails = {};
    if (paymentMethod === 'card' && paymentDetails?.cardNumber) {
      const cardNumber = paymentDetails.cardNumber.replace(/\s/g, '');
      safePaymentDetails.last4Digits = cardNumber.slice(-4);
    } else if (paymentMethod === 'upi' && paymentDetails?.upiId) {
      safePaymentDetails.upiId = paymentDetails.upiId;
    } else if (paymentMethod === 'wallet') {
      if (paymentDetails?.walletProvider) {
        safePaymentDetails.walletProvider = paymentDetails.walletProvider;
      }
      if (paymentDetails?.walletNumber) {
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

// Connect to MongoDB
async function connectDB() {
  try {
    if (!MONGO_URI) {
      console.error('❌ Error: MongoDB Atlas connection string not configured!');
      if (process.env.VERCEL) {
        console.error('Please set MONGO_URI environment variable in Vercel dashboard');
      } else {
        console.error('Please create server/.env file with your MONGO_URI');
      }
      return;
    }
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  }
}

// Initialize database connection
connectDB();

// Start server only if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  async function start() {
    try {
      if (!MONGO_URI) {
        console.error('❌ Error: MongoDB Atlas connection string not configured!');
        console.error('Please create server/.env file with your MONGO_URI');
        console.error('');
        console.error('Example .env file content:');
        console.error('MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookmyshow?retryWrites=true&w=majority');
        console.error('');
        console.error('⚠️  Important: Add /bookmyshow before the ? in your connection string!');
        process.exit(1);
      }
      
      await mongoose.connect(MONGO_URI);
      console.log('✅ Connected to MongoDB Atlas');
      console.log('📦 Backend ready - Only booking endpoints available (movies are in frontend)');
      app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Failed to start server:', err.message);
      if (err.message.includes('authentication failed')) {
        console.error('💡 Tip: Check your MongoDB Atlas username and password in .env file');
      } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
        console.error('💡 Tip: Check your MongoDB Atlas cluster URL in .env file');
      }
      process.exit(1);
    }
  }
  
  start();
}

// Export for Vercel serverless
module.exports = app;

