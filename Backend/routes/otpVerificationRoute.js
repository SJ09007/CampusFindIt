const express = require("express");
const router = express.Router();
const otpcontroller = require("../controllers/OTPController");
const isauth = require("../service/userAuth");

router.route("/sendotp").post(otpcontroller.sendOtp);
router.route("/verifyotp").post(otpcontroller.verifyOtp);


module.exports = router;