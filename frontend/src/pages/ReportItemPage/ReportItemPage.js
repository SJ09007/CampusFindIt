// src/pages/ReportItemPage/ReportItemPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ReportItemPage.module.css";
import HomeNavbar from "../HomePage/components/HomeNavbar";
import ReportItemForm from "../HomePage/components/ReportItemForm";

const ReportItemPage = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleReportSuccess = () => {
    console.log("Report submitted successfully. Redirecting to home.");
    // Redirect to home page after successful submission
    navigate("/home");
  };

  return (
    <div className={styles.pageContainer}>
      <HomeNavbar onLogout={onLogout} />
      
      <div className={styles.content}>
        <ReportItemForm onSuccess={handleReportSuccess} />
      </div>
    </div>
  );
};

export default ReportItemPage;
