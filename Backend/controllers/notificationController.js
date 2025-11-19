const { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } = require("../service/notificationService");

/**
 * Get all notifications for the current user
 */
const getMyNotifications = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const notifications = await getUserNotifications(req.user.id);
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get unread notification count
 */
const getUnreadNotificationCount = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const count = await getUnreadCount(req.user.id);
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Mark a notification as read
 */
const markNotificationAsRead = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        await markAsRead(req.params.id);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        await markAllAsRead(req.user.id);
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getMyNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
