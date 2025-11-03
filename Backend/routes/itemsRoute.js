const express = require("express");
const router = express.Router();
// const { createItem, getAllItems, getFoundItems, getLostItems, getMyItemsPosted, getMyPostedItemsFound, getMyPostedItemsLost, getItemsPostedOnDate, update_status } = require("../controllers/itemController");
const  isAuthenticted = require("../service/userAuth");
const { createItem, getAllItems, getFoundItems, getLostItems, getMyItemsPosted, getMyPostedItemsFound, getMyPostedItemsLost, getItemsPostedOnDate, update_status } = require("../controllers/itemController");


router.post("/create", isAuthenticted,createItem);
router.route("/getall").get(isAuthenticted, getAllItems);
router.route("/getfound").get(isAuthenticted, getFoundItems);
router.route("/getlost").get(isAuthenticted, getLostItems);
router.route("/getmyposted").get(isAuthenticted, getMyItemsPosted);
router.route("/getmypostedfound").get(isAuthenticted, getMyPostedItemsFound);
router.route("/getmypostedlost").get(isAuthenticted, getMyPostedItemsLost);
router.route("/getondate/:date").get(isAuthenticted, getItemsPostedOnDate);
router.route("/updatestatus/:id").put(isAuthenticted, update_status);



module.exports = router;