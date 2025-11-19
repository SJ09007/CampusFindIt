const express = require("express");
const router = express.Router();
const {
    getMyNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");
const isauth = require("../service/userAuth");

// Get all notifications for current user
router.get("/", isauth, getMyNotifications);

// Get unread notification count
router.get("/unread-count", isauth, getUnreadNotificationCount);

// Mark a notification as read
router.put("/:id/read", isauth, markNotificationAsRead);

// Mark all notifications as read
router.put("/read-all", isauth, markAllNotificationsAsRead);

module.exports = router;
