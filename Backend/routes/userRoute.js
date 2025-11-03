const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isauth = require("../service/userAuth");

router.route("/register").post(userController.registerUser);
router.route("/registeradmin").post(userController.registerAdmin);
router.route("/login").post(userController.login);
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password").post(userController.resetPassword);
router.route("/verify-reset-otp").post(userController.verifyResetOtp);
router
  .route("/reset-password/confirm")
  .post(userController.confirmResetPassword);
router.route("/logout").post(isauth, userController.logout);
router.route("/delete/:id").delete(isauth, userController.delete_user);
router.route("/get/:id").get(isauth, userController.get_user_detail);
router.route("/changepassword/:id").put(isauth, userController.changepassword);
router.route("/update/:id").put(isauth, userController.update_user);

module.exports = router;
