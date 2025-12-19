// Use Vercel API routes in production, localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create booking');
  }

  return res.json();
}

export async function fetchBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`);
  if (!res.ok) {
    throw new Error('Failed to load bookings');
  }
  return res.json();
}



