// src/pages/LandingPageNew.jsx
// Landing Page đột phá cho SchoolHub - Tối ưu chuyển đổi
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Landing Components
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import SocialProofRealtime from '../components/landing/SocialProofRealtime';
import PainPointsSection from '../components/landing/PainPointsSection';
import SolutionsSection from '../components/landing/SolutionsSection';
import DemoLessonSection from '../components/landing/DemoLessonSection';
import BeforeAfterSection from '../components/landing/BeforeAfterSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import GuaranteeSection from '../components/landing/GuaranteeSection';
import SimpleRegisterForm from '../components/landing/SimpleRegisterForm';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';
import FloatingCTA from '../components/landing/FloatingCTA';
import ExitIntentPopup from '../components/landing/ExitIntentPopup';

export default function LandingPageNew() {
  const location = useLocation();
  const demoRef = useRef(null);

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

  // Scroll to demo section
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Open video modal (placeholder - could integrate with a modal library)
  const handleWatchVideo = () => {
    // For now, scroll to demo section
    // In production, this would open a video modal
    window.open('https://youtube.com/@schoolhub', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags are in index.html */}

      {/* Sticky Header */}
      <LandingHeader />

      {/* 1. Hero Section - Điểm nhấn đầu tiên */}
      <HeroSection
        onTryDemo={scrollToDemo}
        onWatchVideo={handleWatchVideo}
      />

      {/* 2. Social Proof Realtime - Tạo niềm tin */}
      <SocialProofRealtime />

      {/* 3. Pain Points - Chạm vào nỗi đau */}
      <PainPointsSection onScrollToDemo={scrollToDemo} />

      {/* 4. Solutions - Giải pháp */}
      <SolutionsSection />

      {/* 5. Demo Lesson - Trải nghiệm thực tế */}
      <DemoLessonSection />

      {/* 6. Before/After - So sánh trước/sau */}
      <BeforeAfterSection />

      {/* 7. Testimonials - Lời chứng thực */}
      <TestimonialsSection />

      {/* 8. Features - Tính năng nổi bật */}
      <FeaturesSection />

      {/* 9. Pricing - Bảng giá */}
      <PricingSection />

      {/* 10. Guarantee - Cam kết hoàn tiền */}
      <GuaranteeSection />

      {/* 11. Simple Register Form - Form đăng ký */}
      <SimpleRegisterForm />

      {/* 12. FAQ - Câu hỏi thường gặp */}
      <FAQSection />

      {/* 13. Footer */}
      <Footer />

      {/* 14. Floating CTA - Nút CTA nổi */}
      <FloatingCTA />

      {/* 15. Exit Intent Popup - Popup khi rời trang */}
      <ExitIntentPopup />
    </div>
  );
}
