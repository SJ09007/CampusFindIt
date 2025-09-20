const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/delete/:id").delete(userController.delete_user);
router.route("/get/:id").get(userController.get_user_detail);

module.exports = router;
