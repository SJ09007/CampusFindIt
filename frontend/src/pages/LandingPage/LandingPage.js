import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

// CRITICAL CHANGE: Accept onNavigate prop
const LandingPage = ({ onNavigate }) => {
  return (
    <>
      {/* Pass onNavigate to Navbar, HeroSection, and CTASection */}
      <Navbar onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <HowItWorks />
      <StatsSection />
      <CTASection onNavigate={onNavigate} />
      <Footer />
    </>
  );
};

export default LandingPage;
