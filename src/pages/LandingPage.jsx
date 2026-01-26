// src/pages/LandingPage.jsx
// Landing Page for SchoolHub
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Landing Components
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TargetUsers from '../components/landing/TargetUsers';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const location = useLocation();

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags are in index.html */}

      {/* Sticky Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Target Users Section */}
      <TargetUsers />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials & Stats Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
