import React from "react";
import Navbar from "./components/Navbar";
import BannerSection from "./components/BannerSection";
import FoundItemsSection from "./components/FoundItemsSection";
import LostItemsSection from "./components/LostItemsSection";
import Footer from "./components/Footer";
import styles from "./styles/HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.home}>
      <Navbar />
      <BannerSection />
      <FoundItemsSection />
      <LostItemsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
