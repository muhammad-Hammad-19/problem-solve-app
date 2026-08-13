import { Notification } from "../models/notification.model.js";

// GET all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log(userId,"userid");

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name")
      .populate("feed", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH mark single notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
