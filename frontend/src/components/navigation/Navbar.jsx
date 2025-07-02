import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/navbar.css';

const Navbar = ({ showLinks = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (location.pathname === '/') {
      // If we're already on home page, scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow page transition
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '#contact', onClick: handleContactClick },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src="/assets/images/logo.png" alt="HealthTrack Logo" className="logo-icon" />
          <span>HealthTrack</span>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </div>

        {/* Navigation Links */}
        {showLinks && (
          <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={link.onClick || (() => setIsOpen(false))}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Buttons */}
        {showLinks && (
          <div className={`navbar-buttons ${isOpen ? 'open' : ''}`}>
            <Link to="/signin">
              <button className="btn btn-secondary">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-primary">Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;