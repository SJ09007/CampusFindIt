const express = require("express");
const router = express.Router();
const { addClaim, getItemClaims} = require("../controllers/claimsController");
const isauth = require("../service/userAuth");

router.route("/addclaim/:id").post(isauth, addClaim);
router.route("/getclaims/:id").get(isauth, getItemClaims);




module.exports = router;