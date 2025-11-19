const express = require("express");
const router = express.Router();
const { 
    addClaim, 
    getItemClaims, 
    getClaimCount,
    approveClaim,
    rejectClaim,
    getMyClaims
} = require("../controllers/claimsController");
const isauth = require("../service/userAuth");

// Add a claim to an item
router.post("/addclaim/:id", isauth, addClaim);

// Get all claims for an item
router.get("/getclaims/:id", isauth, getItemClaims);

// Get claim count for an item (public - for displaying on cards)
router.get("/count/:id", getClaimCount);

// Approve a claim
router.post("/approve/:id", isauth, approveClaim);

// Reject a claim
router.post("/reject/:id", isauth, rejectClaim);

// Get all claims made by the current user
router.get("/myclaims", isauth, getMyClaims);

module.exports = router;