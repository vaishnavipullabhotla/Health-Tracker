import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/navbar1.css';
import { FiHome, FiCalendar, FiPieChart, FiMoon, FiSun, FiTarget, FiClock, FiUser, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ showLinks = true, darkMode = false, toggleDarkMode = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout(); // Clear auth context
    setIsProfileOpen(false); // Close the dropdown
    navigate('/'); // Redirect to home page
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Workouts', path: '/workouts', icon: <FiCalendar /> },
    { name: 'Nutrition', path: '/nutrition', icon: <FiPieChart /> },
    { name: 'Sleep', path: '/sleep', icon: <FiClock /> },
    { name: 'Goals', path: '/goals', icon: <FiTarget /> },
  ];

  // Use authenticated user data or fallback to a default user if not logged in
  const currentUser = user || {
    name: 'Guest',
    email: 'guest@example.com',
    initial: 'G',
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/assets/images/logo.png" alt="HealthTrack Logo" className="logo-icon" />
          <span>HealthTrack</span>
        </div>

        {showLinks && (
          <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-right">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </div>

          <div className="profile-section">
            <div className="profile-button" onClick={toggleProfileMenu}>
              {currentUser.profileImage ? (
                <img 
                  src={currentUser.profileImage} 
                  alt={currentUser.name} 
                  className="profile-image"
                />
              ) : (
                <FiUser className="profile-icon" />
              )}
            </div>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-details">
                  <p className="profile-name">{currentUser.name}</p>
                  <p className="profile-email">{currentUser.email}</p>
                </div>
                <div className="profile-dropdown-divider"></div>
                <button className="view-profile-button" onClick={handleViewProfile}>
                  <FiUser /> View Profile
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
               
              </div>
            )}
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;