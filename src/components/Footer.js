import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [contactForm, setContactForm] = useState({
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email.trim() || !contactForm.message.trim()) {
      alert('Please fill in your email and message before sending.');
      return;
    }
    alert('Thank you for contacting us! Your message has been received.');
    setContactForm({ email: '', message: '' });
  };

  const handleQuickLinkClick = (label) => (e) => {
    e.preventDefault();
    alert(`${label} page is coming soon in this demo.`);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1 className="logo-text">BookMyShow</h1>
          <p>
            BookMyShow is India's largest entertainment ticketing portal.
          </p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#" onClick={handleQuickLinkClick('About Us')}>About Us</a></li>
            <li><a href="#" onClick={handleQuickLinkClick('Contact Us')}>Contact Us</a></li>
            <li><a href="#" onClick={handleQuickLinkClick('Careers')}>Careers</a></li>
            <li><a href="#" onClick={handleQuickLinkClick('Terms of Use')}>Terms of Use</a></li>
          </ul>
        </div>
        <div className="footer-section contact-form">
          <h2>Contact us</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              className="text-input contact-input"
              placeholder="Your email address"
              value={contactForm.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              className="text-input contact-input"
              placeholder="Your message"
              value={contactForm.message}
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} BookMyShow | Designed by You
      </div>
    </footer>
  );
};

export default Footer;
