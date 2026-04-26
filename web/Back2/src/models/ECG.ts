import mongoose, { Document, Schema, Types } from "mongoose";

export type EcgStatus = "Anormal" | "Normal" | "En attente" | "pending";

export interface IEcg extends Document {
  // anciens champs
  patientId?: Types.ObjectId;
  doctorId?: Types.ObjectId;
  fileUrl?: string;
  originalFileName?: string;
  diagnosis?: string;

  // nouveaux champs
  title?: string;
  originalImage?: string;
  patient?: Types.ObjectId | null;
  doctor?: Types.ObjectId;
  uploadedBy?: Types.ObjectId;
  urgent?: boolean;
  result?: "Anormal" | "Normal" | "En attente";
  status: EcgStatus;
  condition?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ecgSchema = new Schema<IEcg>(
  {
    // anciens champs
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fileUrl: {
      type: String,
      trim: true,
      required: false,
    },
    originalFileName: {
      type: String,
      trim: true,
      required: false,
    },
    diagnosis: {
      type: String,
      default: "ECG en attente d’analyse",
      trim: true,
    },

    // nouveaux champs
    title: {
      type: String,
      trim: true,
      required: false,
    },
    originalImage: {
      type: String,
      trim: true,
      required: false,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    result: {
      type: String,
      enum: ["Anormal", "Normal", "En attente"],
      default: "En attente",
    },
    status: {
      type: String,
      enum: ["Anormal", "Normal", "En attente", "pending"],
      default: "En attente",
    },
    condition: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ECG = mongoose.model<IEcg>("ECG", ecgSchema);

export default ECG;