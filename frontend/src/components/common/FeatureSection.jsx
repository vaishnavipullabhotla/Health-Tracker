import React from 'react';
import FeatureCard from './FeatureCard';
import { Link } from 'react-router-dom';
import '../../styles/components/feature-section.css';

const features = [
  {
    icon: '/assets/images/icons/activity.png',
    title: 'Activity Tracking',
    description: 'Track your steps and workouts in real-time.',
  },
  {
    icon: '/assets/images/icons/nutrition.png',
    title: 'Nutrition Monitoring',
    description: 'Log meals and monitor your diet.',
  },
  {
    icon: '/assets/images/icons/sleep.png',
    title: 'Sleep Analytics',
    description: 'Analyze your sleep for better rest.',
  },
];

const FeatureSection = () => {
  return (
    <section className="home-feature-section">
      <h2>Features to Transform Your Health</h2>
      <p>Explore the tools that make health tracking effortless.</p>
      <div className="home-feature-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
      <div className="home-feature-cta">
        <Link to="/features" className="btn btn-primary">
          See All Features
        </Link>
      </div>
    </section>
  );
};

export default FeatureSection;