import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BookingPage from './pages/BookingPage';
import AuthModal from './components/AuthModal';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };
  
  const handleSignIn = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Header
          user={user}
          onSignInClick={handleOpenAuth}
          onSignOut={handleSignOut}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/book" element={<BookingPage user={user} />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={handleCloseAuth}
          onSignIn={handleSignIn}
        />
      </div>
    </Router>
  );
}

export default App;
