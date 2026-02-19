import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    tenure: {
      type: Number,
      required: true,
    },
    damageReported: {
      type: Boolean,
      default: false,
    },

    damageNotes: String,

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    pickupDate: {
      type: Date,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["PENDING", "SCHEDULED", "OUT_FOR_DELIVERY", "DELIVERED"],
      default: "PENDING",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

const rentModel = mongoose.model("Rental", rentalSchema);

export default rentModel;
