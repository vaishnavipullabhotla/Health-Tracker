import React from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import '../styles/components/features.css';

const features = [
  {
    id: 'activity',
    title: 'Activity Tracking',
    description: 'Track your daily steps, workouts, and calories burned with real-time updates. Set goals, monitor your progress, and stay motivated with personalized insights.',
    icon: '/assets/images/icons/activity.png',
    image: '/assets/images/activityf.jpg',
  },
  {
    id: 'nutrition',
    title: 'Nutrition Monitoring',
    description: 'Log your meals, monitor your macros, and maintain a balanced diet. Get recommendations tailored to your dietary needs and health goals.',
    icon: '/assets/images/icons/nutrition.png',
    image: '/assets/images/nutritionf.jpeg',
  },
  {
    id: 'sleep',
    title: 'Sleep Analytics',
    description: 'Analyze your sleep patterns to improve your rest and recovery. Understand your sleep cycles and get tips for better sleep quality.',
    icon: '/assets/images/icons/sleep.png',
    image: '/assets/images/sleepf.jpeg',
  },
];

const Features = () => {
  return (
    <div className="features-page">
      <Navbar showLinks={true} />
      <div className="features-container">
        {/* Hero Section */}
        <section className="features-hero">
          <h1>Explore Our Features</h1>
          <p>Discover how HealthTrack helps you achieve your wellness goals with powerful tools.</p>
        </section>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <section key={index} id={feature.id} className={`feature-section ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="feature-content">
              <img src={feature.icon} alt={`${feature.title} icon`} className="feature-icon" />
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              <button className="btn btn-primary">Learn More</button>
            </div>
            <img src={feature.image} alt={`${feature.title} illustration`} className="feature-image" />
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Features;