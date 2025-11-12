// ReportItemForm.js
import React, { useState, useEffect } from "react";
import styles from "../styles/ReportItemForm.module.css"; // adjust if your styles path differs

const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:3100";

const ReportItemForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
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
    // clear messages when user types
    setMessage({ type: "", text: "" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // optional: limit the number of images to 5
    const sliced = files.slice(0, 5);
    setImageFiles(sliced);
    setMessage({ type: "", text: "" });
  };

  const validateBeforeSubmit = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.category) return "Category is required";
    if (!formData.status) return "Status is required";
    if (!formData.location.trim()) return "Location is required";
    // When reporting a found item, require at least one image
    if (formData.status === "found" && imageFiles.length === 0) {
      return "Please upload at least one image for found items.";
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
      fd.append("category", formData.category);
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

      const json = await res.json();
      if (!res.ok) {
        const errMsg =
          json?.message || json?.error || "Failed to submit report";
        throw new Error(errMsg);
      }

      setMessage({ type: "success", text: "Report submitted successfully." });
      // reset form
      setFormData({
        title: "",
        description: "",
        category: "Electronics",
        status: "lost",
        location: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setImageFiles([]);
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
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Electronics">Electronics</option>
            <option value="ID_Cards">ID Cards / Documents</option>
            <option value="Apparel">Clothing / Apparel</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
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
            Images {formData.status === "found" ? "(required)" : "(optional)"}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <div className={styles.hint}>
            You can upload up to 5 images. Max size 6MB each.
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
                    // remove selected file
                    const newFiles = imageFiles.filter((_, idx) => idx !== i);
                    setImageFiles(newFiles);
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
