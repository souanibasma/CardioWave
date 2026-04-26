import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "doctor" | "patient";
  isApproved: boolean;

  // Patient fields
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  assignedDoctor?: Types.ObjectId | null;

  // Doctor fields
  specialty?: string;
  licenseNumber?: string;
  hospitalOrClinic?: string;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
      default: "patient",
    },

    
      isApproved: {
      type: Boolean,
      default: false,
    },

    // Patient fields
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: undefined,
    },

    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Doctor fields
    specialty: {
      type: String,
      default: "",
      trim: true,
    },

    licenseNumber: {
      type: String,
      default: "",
      trim: true,
    },

    hospitalOrClinic: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;