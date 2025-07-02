import React from 'react';
import '../../styles/components/feature-card.css';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="home-feature-card">
      <img src={icon} alt={`${title} icon`} className="home-feature-card-icon" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;