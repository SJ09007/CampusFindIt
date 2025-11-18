// Backend/controllers/itemController.js
const Item = require("../models/itemsModel");
const ClaimedItem = require("../models/ClaimsModels");
const cloudinary = require("../config/cloudinaryConfig");
const streamifier = require("streamifier");

/**
 * Create Item — handles both lost & found items.
 * Found items require at least one image (uploads to Cloudinary).
 */
const createItem = async (req, res) => {
  try {
    const { title, description, category, status, location, date } = req.body;

    // Validate fields
    if (!title || !description || !category || !status || !location) {
      return res
        .status(400)
        .json({ message: "All required fields are missing" });
    }

    // Ensure user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No user found in request." });
    }

    const files = req.files || [];

    // Enforce image upload for found items
    if (status === "found" && files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required for reporting a found item",
      });
    }

    // Upload files to Cloudinary (if any)
    const uploadedUrls = [];
    for (const file of files) {
      const uploaded = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "lostfound",
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      }).catch((err) => {
        console.error("Cloudinary upload error:", err);
        throw err;
      });

      if (uploaded && uploaded.secure_url)
        uploadedUrls.push(uploaded.secure_url);
    }

    // Create new item
    const item = new Item({
      title,
      description,
      category,
      status,
      location,
      date: date ? new Date(date) : new Date(),
      postedBy: req.user.id,
      images: uploadedUrls,
    });

    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error("createItem error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Get all items
 */
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getAllItems error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get found items
 */
const getFoundItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "found" })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getFoundItems error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get lost items
 */
const getLostItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "lost" })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getLostItems error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all items posted by the logged-in user
 */
const getMyItemsPosted = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const items = await Item.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getMyItemsPosted error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get only 'found' items posted by logged-in user
 */
const getMyPostedItemsFound = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const items = await Item.find({ postedBy: req.user.id, status: "found" })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getMyPostedItemsFound error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get only 'lost' items posted by logged-in user
 */
const getMyPostedItemsLost = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const items = await Item.find({ postedBy: req.user.id, status: "lost" })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getMyPostedItemsLost error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get items posted on a specific date
 */
const getItemsPostedOnDate = async (req, res) => {
  try {
    const dateParam = req.params.date;
    // parse dateParam safely (expects YYYY-MM-DD)
    const start = new Date(dateParam);
    const end = new Date(dateParam);
    end.setDate(end.getDate() + 1);

    const items = await Item.find({ date: { $gte: start, $lt: end } })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    console.error("getItemsPostedOnDate error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update item status — called when item is claimed/reported.
 */
const update_status = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (["claimed", "reported"].includes(item.status)) {
      return res
        .status(400)
        .json({ message: "Item has already been claimed/reported" });
    }

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (item.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own items" });
    }

    // find all persons who have claimed the item (if needed later)
    // const claims = await ClaimedItem.find({ item: req.params.id });

    // Handle status change
    if (item.status === "lost") {
      item.status = "reported";
      item.claimedBy = req.body.userid || item.claimedBy;
    } else if (item.status === "found") {
      item.status = "claimed";
      item.claimedBy = req.body.userid || item.claimedBy;
    }

    await item.save();
    res.status(200).json({ message: "Item status has been updated" });
  } catch (err) {
    console.error("update_status error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Claim a found item
 */
const claimFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy.toString() === req.user.id)
      return res.status(400).json({ message: "You cannot claim your own item" });

    const claim = new ClaimedItem({
      itemId: id,
      claimerId: req.user.id,
      message,
    });
    await claim.save();

    // Notify the owner (email logic can be added here)
    res.status(201).json({ message: "Claim submitted successfully" });
  } catch (err) {
    console.error("claimFoundItem error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Report a lost item as found
 */
const reportLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { whenWhere, extra } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy.toString() === req.user.id)
      return res.status(400).json({ message: "You cannot report your own item" });

    const report = new ClaimedItem({
      itemId: id,
      claimerId: req.user.id,
      message: `Found at: ${whenWhere}. ${extra}`,
    });
    await report.save();

    // Notify the owner (email logic can be added here)
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("reportLostItem error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Approve a claim or report
 */
const approveClaimOrReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const claim = await ClaimedItem.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim/Report not found" });

    const item = await Item.findById(claim.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only approve claims/reports for your own items" });

    claim.approved = true;
    await claim.save();

    // Notify the claimer/reporter (email logic can be added here)
    res.status(200).json({ message: "Claim/Report approved successfully" });
  } catch (err) {
    console.error("approveClaimOrReport error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getFoundItems,
  getLostItems,
  getMyItemsPosted,
  getMyPostedItemsFound,
  getMyPostedItemsLost,
  getItemsPostedOnDate,
  update_status,
  claimFoundItem,
  reportLostItem,
  approveClaimOrReport,
};
