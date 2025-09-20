const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isauth = require("../service/userAuth");

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);

router.route("/delete/:id").delete(isauth, userController.delete_user);
router.route("/get/:id").get(isauth, userController.get_user_detail);

module.exports = router;
