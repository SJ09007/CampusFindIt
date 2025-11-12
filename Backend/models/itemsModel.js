// Backend/models/itemsModel.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "wallet",
        "keys",
        "phone",
        "laptop",
        "earphones",
        "mobile",
        "tablet",
        "camera",
        "accessories",
        "other",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["lost", "found", "reported", "claimed"],
      default: "lost",
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      // not required at schema level — the controller/front-end provides this
    },
    // posted by which user
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // claimed by which user
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // images: array of URLs (Cloudinary secure URLs or local paths)
    images: {
      type: [String],
      default: [], // not required at DB level; enforce per-status in controller
    },
  },
  {
    timestamps: true,
  }
);

// Optional virtual: first image (thumbnail) or null
itemSchema.virtual("thumbnail").get(function () {
  return this.images && this.images.length ? this.images[0] : null;
});

module.exports = mongoose.model("Item", itemSchema);
