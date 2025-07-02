import React from 'react';
import '../../styles/components/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/images/logo.png" alt="HealthTrack Logo" />
          <span>HealthTrack</span>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#blog">Blog</a>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2023 HealthTrack. All rights reserved.</p>
        <div className="footer-social">
          <img src="/assets/images/icons/social/twitter.png" alt="Twitter" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;