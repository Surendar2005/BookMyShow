import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { getAllMovies } from '../data/movies';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const movies = getAllMovies();

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to BookMyShow</h1>
        <p>Book your favorite movies, events, and shows</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="movies-section">
        <h2 className="section-title">Now Showing</h2>
        {filteredMovies.length === 0 ? (
          <div className="no-results">
            <p>No movies found matching your search.</p>
          </div>
        ) : (
          <div className="movie-list">
            {filteredMovies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
                <div className="movie-card">
                  <div className="movie-poster">
                    <img src={movie.posterUrl} alt={movie.title} />
                    <div className="movie-rating">{movie.rating} ⭐</div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-genre">{movie.genre}</p>
                    <p className="movie-duration">{movie.duration}</p>
                    <div className="movie-price">₹{movie.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
