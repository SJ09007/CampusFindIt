// Backend/routes/itemsRoute.js
const express = require("express");
const router = express.Router();

const isAuthenticted = require("../service/userAuth");
const multerMemory = require("../multerMemory");
const {
  createItem,
  getAllItems,
  getFoundItems,
  getLostItems,
  getMyItemsPosted,
  getMyPostedItemsFound,
  getMyPostedItemsLost,
  getItemsPostedOnDate,
  update_status,
} = require("../controllers/itemController");

/**
 * POST /create
 * - Protected: requires authentication
 * - Accepts multipart/form-data with field name "images" (up to 5 files)
 */
router.post(
  "/create",
  isAuthenticted,
  multerMemory.array("images", 5),
  createItem
);

/**
 * Public listings (no auth) so homepage can fetch without token
 */
router.get("/getall", getAllItems);
router.get("/getfound", getFoundItems);
router.get("/getlost", getLostItems);

/**
 * User-specific routes (require auth)
 */
router.get("/getmyposted", isAuthenticted, getMyItemsPosted);
router.get("/getmypostedfound", isAuthenticted, getMyPostedItemsFound);
router.get("/getmypostedlost", isAuthenticted, getMyPostedItemsLost);

/**
 * Items posted on a specific date (public)
 */
router.get("/getondate/:date", getItemsPostedOnDate);

/**
 * Update status (protected)
 */
router.put("/updatestatus/:id", isAuthenticted, update_status);

module.exports = router;
