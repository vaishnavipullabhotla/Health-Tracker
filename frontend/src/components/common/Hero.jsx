import React from 'react';
import '../../styles/components/hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Track Your Health.<br />Live Better.</h1>
        <p>Monitor your fitness, nutrition, and sleep all in one place.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </div>
      <img src="/assets/images/hero.png" alt="Health tracking illustration" className="hero-illustration" />
    </section>
  );
};

export default Hero;