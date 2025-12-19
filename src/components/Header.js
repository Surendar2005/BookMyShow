import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onSignInClick, onSignOut }) => {
  return (
    <div className="header">
      <div className="logo">
        <Link to="/">BookMyShow</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Movies</Link>
        <Link to="/">Events</Link>
        <Link to="/">Plays</Link>
        <Link to="/">Sports</Link>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search for Movies, Events, Plays, Sports and Activities" />
      </div>
      <div className="user-actions">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <button onClick={onSignOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={onSignInClick}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Header;
