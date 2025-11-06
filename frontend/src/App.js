// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthenticationPage from "./pages/Authentication/AuthenticationPage";
import HomePage from "./pages/HomePage/HomePage";
import OtpPage from "./pages/OTPpage/OtpPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage";

/**
 * PrivateRoute
 * Simple wrapper that checks localStorage for the access token at render time.
 * If no token, it redirects to /auth.
 * If you later switch to httpOnly cookie auth, replace this logic with an API call (/api/users/me).
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/auth" replace />;
}

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("isVerified");
    // Redirect to the landing page after logout
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected /home route using PrivateRoute to read the latest localStorage value */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Catch-all -> landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
