// ReportItemForm.js
import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import styles from "../styles/ReportItemForm.module.css"; // adjust if your styles path differs

const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:3100";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

// Utility function to create cropped image
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const ReportItemForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "clothes",
    status: "lost",
    location: "",
    date: new Date().toISOString().slice(0, 10),
    contactEmail: "",
    contactPhone: "",
  });

  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // preview URLs
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
    if (files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Check if image needs cropping
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          setImageToCrop(event.target.result);
          setShowCropper(true);
        } else {
          // Image is small enough, use it directly
          setImageFiles([file]);
        }
      };
      img.src = event.target.result;
    };
    
    reader.readAsDataURL(file);
    setMessage({ type: "", text: "" });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      setImageFiles([croppedFile]);
      setShowCropper(false);
      setImageToCrop(null);
    } catch (e) {
      console.error("Error cropping image:", e);
      setMessage({ type: "error", text: "Failed to crop image" });
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
      
      // Add contact info if provided
      if (formData.contactEmail) fd.append("contactEmail", formData.contactEmail);
      if (formData.contactPhone) fd.append("contactPhone", formData.contactPhone);

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
        contactEmail: "",
        contactPhone: "",
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

      {showCropper && (
        <div className={styles.cropperModal}>
          <div className={styles.cropperContainer}>
            <h3>Crop Your Image</h3>
            <p className={styles.cropperHint}>
              Your image is larger than {MAX_WIDTH}x{MAX_HEIGHT}px. Please crop it to reduce file size.
            </p>
            <div className={styles.cropperWrapper}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className={styles.cropperControls}>
              <label className={styles.zoomLabel}>
                Zoom:
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className={styles.zoomSlider}
                />
              </label>
              <div className={styles.cropperButtons}>
                <button
                  type="button"
                  onClick={cancelCrop}
                  className={styles.cancelCropBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createCroppedImage}
                  className={styles.applyCropBtn}
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
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
          <label className={styles.label}>Contact Email (optional)</label>
          <input
            className={styles.input}
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Your preferred contact email"
          />
          <div className={styles.hint}>
            ⚠️ This will only be shared with approved claimants. Leave blank to use your account email.
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Contact Phone (optional)</label>
          <input
            className={styles.input}
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Your preferred contact number"
          />
          <div className={styles.hint}>
            ⚠️ This will only be shared with approved claimants.
          </div>
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
