const Notification = require("../models/notificationModel");

/**
 * Create a new notification
 */
const createNotification = async (userId, type, message, itemId = null, claimId = null) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            message,
            itemId,
            claimId,
            read: false
        });
        console.log(`Notification created for user ${userId}`);
        return notification;
    } catch (err) {
        console.error("Error creating notification:", err);
        return null;
    }
};

/**
 * Get all notifications for a user
 */
const getUserNotifications = async (userId) => {
    try {
        const notifications = await Notification.find({ userId })
            .populate('itemId', 'title images status')
            .populate('claimId')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications
        return notifications;
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return [];
    }
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        console.log(`Notification ${notificationId} marked as read`);
    } catch (err) {
        console.error("Error marking notification as read:", err);
    }
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
    try {
        await Notification.updateMany({ userId, read: false }, { read: true });
        console.log(`All notifications marked as read for user ${userId}`);
    } catch (err) {
        console.error("Error marking all notifications as read:", err);
    }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({ userId, read: false });
        return count;
    } catch (err) {
        console.error("Error getting unread count:", err);
        return 0;
    }
};

/**
 * Delete old notifications (older than 30 days)
 */
const deleteOldNotifications = async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await Notification.deleteMany({ 
            createdAt: { $lt: thirtyDaysAgo },
            read: true 
        });
        console.log(`Deleted ${result.deletedCount} old notifications`);
    } catch (err) {
        console.error("Error deleting old notifications:", err);
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteOldNotifications
};
