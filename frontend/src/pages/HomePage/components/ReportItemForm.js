// ReportItemForm.js
import React, { useState, useEffect } from "react";
import styles from "../styles/ReportItemForm.module.css"; // adjust if your styles path differs

const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:3100";

const ReportItemForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "clothes",
    status: "lost",
    location: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // preview URLs
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // create object URLs for previews
    if (imageFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const objs = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviews(objs);

    // revoke on cleanup
    return () => {
      objs.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const sliced = files.slice(0, 1); // Only allow 1 image
    setImageFiles(sliced);
    setMessage({ type: "", text: "" });
  };

  const validateBeforeSubmit = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.category) return "Category is required";
    if (!formData.status) return "Status is required";
    if (!formData.location.trim()) return "Location is required";
    if (formData.status === "found" && imageFiles.length === 0) {
      return "Please upload an image for found items.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category); // backend value
      fd.append("status", formData.status);
      fd.append("location", formData.location);
      fd.append("date", formData.date);

      imageFiles.forEach((file) => fd.append("images", file));

      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/api/items/create`, {
        method: "POST",
        body: fd,
        headers,
      });

      // try to parse JSON response (server may send JSON even on error)
      let json;
      try {
        json = await res.json();
      } catch (err) {
        json = null;
      }

      if (res.status === 401) {
        // Not authenticated -> redirect to login
        setMessage({
          type: "error",
          text: "You must be logged in to report items. Redirecting to login...",
        });
        setTimeout(() => (window.location.href = "/auth"), 900);
        return;
      }

      if (!res.ok) {
        // Prefer server-sent error message
        const errMsg =
          (json && (json.message || json.error)) ||
          "Failed to submit report (server error)";
        throw new Error(errMsg);
      }

      // Success: show message and reset
      setMessage({ type: "success", text: "Report submitted successfully." });
      setFormData({
        title: "",
        description: "",
        category: "clothes",
        status: "lost",
        location: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setImageFiles([]);
      // Let parent (HomePage) refresh list
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Report submit error:", err);
      setMessage({ type: "error", text: err.message || "Submission failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Report Lost / Found Item</h2>

      {message.text && (
        <div
          className={`${styles.message} ${
            message.type === "success" ? styles.success : styles.error
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={styles.form}
      >
        <div className={styles.row}>
          <label className={styles.label}>Report Type</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="status"
                value="lost"
                checked={formData.status === "lost"}
                onChange={handleChange}
              />
              Lost
            </label>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="status"
                value="found"
                checked={formData.status === "found"}
                onChange={handleChange}
              />
              Found
            </label>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief title (e.g., Black Wallet)"
            required
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item, distinctive marks, etc."
            required
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {[
              { label: "Clothes or Shoes", value: "clothes" },
              { label: "Electronics", value: "electronics" },
              { label: "Books & Notebooks", value: "books_notebooks" },
              { label: "Wallet & Purse", value: "wallet_purse" },
              { label: "Watches", value: "watches" },
              { label: "Spectacles", value: "spectacles" },
              { label: "Keys", value: "keys" },
              { label: "Tiffin or Bottle", value: "tiffin_bottle" },
              { label: "Stationery", value: "stationery" },
              { label: "Others", value: "others" },
            ].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Location</label>
          <input
            className={styles.input}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where it was lost/found"
            required
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Date</label>
          <input
            className={styles.input}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Image {formData.status === "found" ? "(required)" : "(optional)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className={styles.hint}>
            You can upload 1 image. Max size 6MB.
          </div>
        </div>

        {previews && previews.length > 0 && (
          <div className={styles.previewWrapper}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => {
                    setImageFiles((files) => files.filter((_, idx) => idx !== i));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportItemForm;
