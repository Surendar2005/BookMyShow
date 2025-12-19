import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetailsPage.css';
import { getMovieById } from '../data/movies';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="error-message">
          <h2>Movie not found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleBookTickets = () => {
    navigate(`/book?movieId=${movie.id}`);
  };

  return (
    <div className="movie-details-page">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.backdropUrl})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="movie-details-container">
        <div className="movie-details-header">
          <div className="movie-poster-large">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-details-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span className="rating">⭐ {movie.rating}</span>
              <span className="duration">{movie.duration}</span>
              <span className="language">{movie.language}</span>
            </div>
            <div className="movie-details-grid">
              <div className="detail-item">
                <strong>Genre:</strong> {movie.genre}
              </div>
              <div className="detail-item">
                <strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="detail-item">
                <strong>Director:</strong> {movie.director}
              </div>
              <div className="detail-item">
                <strong>Cast:</strong> {movie.cast}
              </div>
            </div>
            <div className="showtimes-preview">
              <strong>Available Showtimes:</strong>
              <div className="showtime-badges">
                {movie.showtimes.slice(0, 3).map((time, index) => (
                  <span key={index} className="showtime-badge">{time}</span>
                ))}
                {movie.showtimes.length > 3 && (
                  <span className="showtime-badge more">+{movie.showtimes.length - 3} more</span>
                )}
              </div>
            </div>
            <button className="book-tickets-button" onClick={handleBookTickets}>
              Book Tickets
            </button>
          </div>
        </div>
        
        <div className="movie-details-description">
          <h2>About the Movie</h2>
          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
