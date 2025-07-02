// D:\health\frontend\src\pages\Profile.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import Navbar from '../components/navigation/Navbar1';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiCamera, FiX } from 'react-icons/fi';
import '../styles/components/profile.css';

const Profile = ({ darkMode, toggleDarkMode }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Focus on modal when it opens
  useEffect(() => {
    if (isEditing && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isEditing]);

  // Handle clicks outside modal to close it
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsEditing(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isEditing]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccess(response.data.message);
      setIsEditing(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`} role="main" aria-label="Profile page">
      <Navbar showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your account settings</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-image">
              <div className="image-placeholder" role="img" aria-label="Profile photo">
                <FiUser />
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <FiUser className="icon" aria-hidden="true" />
                <div className="detail-content">
                  <label>Full Name</label>
                  <p>{user?.name || 'Not set'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FiMail className="icon" aria-hidden="true" />
                <div className="detail-content">
                  <label>Email</label>
                  <p>{user?.email || 'Not set'}</p>
                </div>
              </div>

              <div className="detail-item">
                <FiLock className="icon" aria-hidden="true" />
                <div className="detail-content">
                  <label>Password</label>
                  <button
                    className="change-password-btn"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                    aria-label="Change password"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {(error || success) && (
            <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
              {error || success}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="password-change-modal" role="dialog" aria-labelledby="change-password-title">
            <div className="modal-content" ref={modalRef} tabIndex="-1">
              <button
                className="modal-close-btn"
                onClick={() => setIsEditing(false)}
                aria-label="Close password change modal"
                disabled={loading}
              >
                <FiX />
              </button>
              <h2 id="change-password-title">Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    aria-label="Cancel password change"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} aria-label="Save password changes">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;