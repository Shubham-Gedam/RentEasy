import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental", // rental model ka reference
      required: true,
    },

    issueDescription: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED"],
      default: "PENDING",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    adminNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
