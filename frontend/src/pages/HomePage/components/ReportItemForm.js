import React, { useState } from "react";
import styles from "../styles/ReportItemForm.module.css";

const API_BASE_URL = "http://localhost:3100";

const ReportItemForm = ({ onSuccess }) => {
  // Matches the required fields for the backend's createItem controller
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics", // Default category
    status: "lost", // Default status
    location: "",
    date: new Date().toISOString().slice(0, 10), // Default to today's date (YYYY-MM-DD)
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authentication: Assuming JWT is handled by cookies or a global setup.
          // If you store the token in localStorage, uncomment the line below:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit item report.");
      }

      // Success handling
      setMessage({
        type: "success",
        text: "Item successfully reported! Thank you.",
      });

      // Optionally clear the form or call an onSuccess callback
      setFormData({
        title: "",
        description: "",
        category: "Electronics",
        status: "lost",
        location: "",
        date: new Date().toISOString().slice(0, 10),
      });

      if (onSuccess) {
        onSuccess(); // Optional: Trigger a parent component to refresh the list or redirect
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setMessage({
        type: "error",
        text: err.message.includes("Unauthorized")
          ? "Login required to post an item."
          : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Report a Lost or Found Item</h2>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Status: Lost or Found */}
        <div className={styles.fieldGroup}>
          <label>Report Type</label>
          <div className={styles.statusGroup}>
            <label className={styles.statusLabel}>
              <input
                type="radio"
                name="status"
                value="lost"
                checked={formData.status === "lost"}
                onChange={handleChange}
                className={styles.statusRadio}
                required
              />
              Lost Item
            </label>
            <label className={styles.statusLabel}>
              <input
                type="radio"
                name="status"
                value="found"
                checked={formData.status === "found"}
                onChange={handleChange}
                className={styles.statusRadio}
                required
              />
              Found Item
            </label>
          </div>
        </div>

        {/* Title */}
        <div className={styles.fieldGroup}>
          <label htmlFor="title">Title of Item</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Black Apple Watch Series 7"
            required
          />
        </div>

        {/* Description */}
        <div className={styles.fieldGroup}>
          <label htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Describe the item: color, brand, unique marks, where it was lost/found."
            required
          />
        </div>

        {/* Category */}
        <div className={styles.fieldGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="ID_Cards">ID Cards / Documents</option>
            <option value="Apparel">Clothing / Apparel</option>
            <option value="Accessories">
              Accessories (Jewelry, Glasses, Keys)
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div className={styles.fieldGroup}>
          <label htmlFor="location">Location Lost/Found</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Campus Library, Cafeteria Table 3"
            required
          />
        </div>

        {/* Date */}
        <div className={styles.fieldGroup}>
          <label htmlFor="date">Date Lost/Found</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            max={new Date().toISOString().slice(0, 10)} // Prevent future dates
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportItemForm;
