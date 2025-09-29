import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default LandingPage;
