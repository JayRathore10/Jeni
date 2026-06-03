import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import UploadPreview from '../../components/UploadPreview/UploadPreview';
import Stats from '../../components/Stats/Stats';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Footer from '../../components/Footer/Footer';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <UploadPreview />
        <Stats />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};
