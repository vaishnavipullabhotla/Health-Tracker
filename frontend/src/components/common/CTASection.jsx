import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/cta-section.css';

const CTASection = () => {
  return (
    <section className="home-cta-section">
      <h2>Start Your Health Today</h2>
      <p>Join thousands of users who are living healthier with HealthTrack.</p>
      <Link to="/signup">
        <button className="home-cta-btn">Sign Up Now</button>
      </Link>
    </section>
  );
};

export default CTASection;