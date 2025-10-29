import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthenticationPage from "./pages/Authentication/AuthenticationPage";
import HomePage from "./pages/HomePage/HomePage";
import OtpPage from "./pages/OTPpage/OtpPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage"; // New import

function App() {
  // -----------------------------------------------------
  // 🎯 TESTING MODE: Uncomment ONLY ONE of the return statements below
  // to run a single page for isolated testing.
  // -----------------------------------------------------

  //return <LandingPage onNavigate={() => {}} />; // 1. Test the Landing Page
  // return <AuthenticationPage onLoginSuccess={() => {}} onSignupSuccess={() => {}} onNavigate={() => {}} />; // 2. Test Login/Signup
  // return <OtpPage userEmail="test@example.com" onOtpSuccess={() => {}} onNavigate={() => {}} />; // 3. Test OTP Page
  //return <ForgotPasswordPage onNavigate={() => {}} />; // 4. Test Forgot Password Page
  //return <HomePage onLogout={() => {}} />; // 5. Test Home Page (requires mock token in localStorage)

  // -----------------------------------------------------
  // 🎯 NORMAL MODE (Uncomment everything below this line when done testing)
  // -----------------------------------------------------

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [userEmailForOtp, setUserEmailForOtp] = useState("");

  // 1. Check for stored token on initial load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      setCurrentScreen("home");
    } else {
      setCurrentScreen("landing");
    }
  }, []);

  // 2. Handlers for state changes

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  const handleSignupSuccess = (userData) => {
    setUserEmailForOtp(userData.email);
    setCurrentScreen("otp");
  };

  const handleOtpSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  // Handler for all non-authenticated screen transitions
  const navigateTo = (screen, email = "") => {
    if (screen === "otp") {
      setUserEmailForOtp(email);
    }
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setIsAuthenticated(false);
    setCurrentScreen("landing");
  };

  // 3. Conditional Rendering (The main router logic)
  if (isAuthenticated) {
    return <HomePage onLogout={handleLogout} />;
  }

  switch (currentScreen) {
    case "landing":
      return <LandingPage onNavigate={navigateTo} />;

    case "auth":
      return (
        <AuthenticationPage
          onLoginSuccess={handleLoginSuccess}
          onSignupSuccess={handleSignupSuccess}
          onNavigate={navigateTo}
        />
      );

    case "reset":
      return <ForgotPasswordPage onNavigate={navigateTo} />;

    case "otp":
      return (
        <OtpPage
          userEmail={userEmailForOtp}
          onOtpSuccess={handleOtpSuccess}
          onNavigate={navigateTo}
        />
      );

    default:
      return <LandingPage onNavigate={navigateTo} />;
  }
}

export default App;
