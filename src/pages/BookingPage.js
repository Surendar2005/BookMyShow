import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './BookingPage.css';
import { createBooking } from '../api';
import { getMovieById } from '../data/movies';

const BookingPage = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'wallet'
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    walletProvider: '',
    walletNumber: ''
  });

  // Generate seat layout (10 rows, 12 seats per row)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;
  const [seatLayout] = useState(() => {
    const layout = {};
    rows.forEach(row => {
      layout[row] = Array(seatsPerRow).fill(null).map((_, index) => ({
        id: `${row}${index + 1}`,
        row: row,
        number: index + 1,
        available: Math.random() > 0.3, // 70% seats available
        type: index < 4 || index > 7 ? 'regular' : 'premium'
      }));
    });
    return layout;
  });

  useEffect(() => {
    if (!movieId) {
      setError('No movie selected for booking.');
      setLoading(false);
      return;
    }
    const movieData = getMovieById(movieId);
    if (!movieData) {
      setError('Movie not found');
      setLoading(false);
      return;
    }
    setMovie(movieData);
    if (movieData.showtimes && movieData.showtimes.length > 0) {
      setSelectedShowtime(movieData.showtimes[0]);
    }
    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    // Pre-fill booking details from signed-in user if available
    if (user) {
      setBookingDetails((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="booking-page">
        <div className="error-message">
          <h2>Loading booking details...</h2>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="booking-page">
        <div className="error-message">
          <h2>{error || 'Movie not found'}</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatPrice = (seatType) => {
    return seatType === 'premium' ? movie.price + 100 : movie.price;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      const seat = seatLayout[row].find(s => s.id === seatId);
      return total + getSeatPrice(seat.type);
    }, 0);
  };

  const handleInputChange = (e) => {
    setBookingDetails({
      ...bookingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber.trim() || !paymentDetails.cardName.trim() || !paymentDetails.expiry.trim() || !paymentDetails.cvv.trim()) {
        alert('Please enter complete card details.');
        return false;
      }
    }
    if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId.trim()) {
        alert('Please enter your UPI ID.');
        return false;
      }
    }
    if (paymentMethod === 'wallet') {
      if (!paymentDetails.walletProvider.trim() || !paymentDetails.walletNumber.trim()) {
        alert('Please enter your wallet provider and number.');
        return false;
      }
    }
    return true;
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (!selectedShowtime) {
      alert('Please select a showtime');
      return;
    }
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone) {
      alert('Please fill in all booking details');
      return;
    }

    if (!validatePayment()) {
      return;
    }

    const total = calculateTotal();

    // Prepare payment details to send to backend
    const paymentData = {};
    if (paymentMethod === 'card') {
      paymentData.cardNumber = paymentDetails.cardNumber;
    } else if (paymentMethod === 'upi') {
      paymentData.upiId = paymentDetails.upiId;
    } else if (paymentMethod === 'wallet') {
      paymentData.walletProvider = paymentDetails.walletProvider;
      paymentData.walletNumber = paymentDetails.walletNumber;
    }

    createBooking({
      movieId: movie.id,
      movieTitle: movie.title, // Send movieTitle to backend
      showtime: selectedShowtime,
      seats: selectedSeats,
      total,
      paymentMethod,
      paymentDetails: paymentData,
      user: bookingDetails,
    })
      .then((response) => {
        alert(
          `Booking confirmed and saved to MongoDB!\n\n` +
          `Booking ID: ${response.booking.id}\n` +
          `Movie: ${movie.title}\n` +
          `Showtime: ${selectedShowtime}\n` +
          `Seats: ${selectedSeats.join(', ')}\n` +
          `Total: ₹${total}\n` +
          `Payment method: ${paymentMethod.toUpperCase()}\n` +
          `Status: ${response.booking.bookingStatus}\n\n` +
          `Thank you for booking with BookMyShow!`
        );
        navigate('/');
      })
      .catch((err) => {
        alert(err.message || 'Failed to create booking');
      });
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
      <h1>Book Tickets</h1>
          <div className="movie-booking-info">
            <img src={movie.posterUrl} alt={movie.title} />
            <div>
              <h2>{movie.title}</h2>
              <p>{movie.genre} • {movie.duration}</p>
            </div>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-left">
            <div className="showtime-selection">
              <h3>Select Showtime</h3>
              <div className="showtime-options">
                {movie.showtimes.map((time, index) => (
                  <button
                    key={index}
                    className={`showtime-btn ${selectedShowtime === time ? 'active' : ''}`}
                    onClick={() => setSelectedShowtime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="seat-selection">
              <h3>Select Seats</h3>
              <div className="screen-indicator">
                <div className="screen">SCREEN THIS WAY</div>
              </div>
              
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="seat-sample available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample selected"></div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample occupied"></div>
                  <span>Occupied</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample premium"></div>
                  <span>Premium</span>
                </div>
              </div>

              <div className="seat-layout">
                {rows.map(row => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    <div className="seats">
                      {seatLayout[row].map(seat => (
                        <button
                          key={seat.id}
                          className={`seat ${!seat.available ? 'occupied' : ''} ${seat.type} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                          onClick={() => seat.available && toggleSeat(seat.id)}
                          disabled={!seat.available}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="row-label">{row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="booking-right">
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Movie:</span>
                <span>{movie.title}</span>
              </div>
              <div className="summary-item">
                <span>Showtime:</span>
                <span>{selectedShowtime || 'Not selected'}</span>
              </div>
              <div className="summary-item">
                <span>Seats:</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</span>
              </div>
              <div className="summary-item">
                <span>Seat Type:</span>
                <span>
                  {selectedSeats.map(seatId => {
                    const row = seatId.charAt(0);
                    const seat = seatLayout[row].find(s => s.id === seatId);
                    return seat.type === 'premium' ? 'Premium' : 'Regular';
                  }).join(', ') || 'N/A'}
                </span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              <h3>Your Details</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <h3>Payment Method</h3>
              <div className="payment-methods">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  Credit / Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  UPI
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  Wallet
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="payment-section">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={handlePaymentChange}
                      placeholder="As printed on card"
                    />
                  </div>
                  <div className="form-group payment-row">
                    <div>
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="expiry"
                        value={paymentDetails.expiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        placeholder="3 digits"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="payment-section">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={paymentDetails.upiId}
                      onChange={handlePaymentChange}
                      placeholder="yourname@upi"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="payment-section">
                  <div className="form-group">
                    <label>Wallet Provider</label>
                    <input
                      type="text"
                      name="walletProvider"
                      value={paymentDetails.walletProvider}
                      onChange={handlePaymentChange}
                      placeholder="Paytm, PhonePe, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Wallet Number</label>
                    <input
                      type="text"
                      name="walletNumber"
                      value={paymentDetails.walletNumber}
                      onChange={handlePaymentChange}
                      placeholder="Registered mobile number"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="confirm-booking-btn">
                Pay & Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
