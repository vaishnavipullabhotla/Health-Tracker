import React from 'react';
import Navbar from '../components/navigation/Navbar';
import Hero from '../components/common/Hero';
import FeatureSection from '../components/common/FeatureSection';
import CTASection from '../components/common/CTASection';
import ContactUs from '../components/common/ContactUs';
import Footer from '../components/navigation/Footer';


const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureSection />
      <CTASection />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;