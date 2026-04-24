import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/authMiddleware";

// GET /api/admin/notifications
export const getAdminNotifications = async (_req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ recipientRole: "admin" })
      .sort({ createdAt: -1 });

    const formatted = notifications.map((n) => ({
      _id: n._id,
      type: n.type,
      titre: n.title,
      desc: n.description,
      date: n.createdAt,
      lue: n.isRead,
      actionLabel: n.actionLabel || undefined,
      actionPath: n.actionPath || undefined,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des notifications",
    });
  }
};

// PATCH /api/admin/notifications/:id/read
export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notif = await Notification.findById(req.params.id);

    if (!notif) {
      return res.status(404).json({
        message: "Notification introuvable",
      });
    }

    notif.isRead = true;
    await notif.save();

    res.status(200).json({
      message: "Notification marquée comme lue",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la notification",
    });
  }
};

// PATCH /api/admin/notifications/read-all
export const markAllNotificationsAsRead = async (_req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipientRole: "admin", isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "Toutes les notifications ont été marquées comme lues",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour des notifications",
    });
  }
};

// GET /api/admin/notifications/unread-count
export const getUnreadNotificationsCount = async (_req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      recipientRole: "admin",
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du comptage des notifications non lues",
    });
  }
};