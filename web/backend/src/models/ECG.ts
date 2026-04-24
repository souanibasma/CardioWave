import mongoose, { Document, Schema } from "mongoose";

export interface IECG extends Document {
  title: string;
  originalImage: string;
  patient: mongoose.Types.ObjectId;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ecgSchema = new Schema<IECG>(
  {
    title: {
      type: String,
      required: true,
    },
    originalImage: {
      type: String,
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IECG>("ECG", ecgSchema);
