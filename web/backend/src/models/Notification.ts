import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  recipientRole: "admin";
  type: "verification" | "inscription" | "ecg" | "systeme";
  title: string;
  description: string;
  isRead: boolean;
  actionLabel?: string;
  actionPath?: string;
  relatedUser?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientRole: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },
    type: {
      type: String,
      enum: ["verification", "inscription", "ecg", "systeme"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionLabel: {
      type: String,
      default: "",
    },
    actionPath: {
      type: String,
      default: "",
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);