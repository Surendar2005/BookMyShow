import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSignIn }) => {
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (mode === 'email' && !form.email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (mode === 'phone' && !form.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    // Simulate successful sign-in
    onSignIn({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      method: mode,
    });
  };

  const handleSocialClick = (provider) => {
    alert(`Social sign-in with ${provider} is simulated in this demo.`);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-title">Sign in to BookMyShow</div>
          <button className="auth-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${mode === 'email' ? 'active' : ''}`}
            onClick={() => setMode('email')}
          >
            Email
          </button>
          <button
            className={`auth-tab ${mode === 'phone' ? 'active' : ''}`}
            onClick={() => setMode('phone')}
          >
            Phone
          </button>
        </div>

        <form className="auth-modal-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          {mode === 'email' && (
            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          )}

          {mode === 'phone' && (
            <div className="auth-form-group">
              <label>Phone number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
            </div>
          )}

          <button type="submit" className="auth-primary-btn">
            Continue
          </button>
        </form>

        <div className="auth-secondary-actions">
          or sign in with
        </div>

        <div className="auth-social-buttons">
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleSocialClick('Google')}
          >
            <span>G</span> Continue with Google
          </button>
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleSocialClick('Facebook')}
          >
            <span>f</span> Continue with Facebook
          </button>
        </div>

        <div className="auth-terms">
          By continuing, you agree to the Terms of Use and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default AuthModal;



