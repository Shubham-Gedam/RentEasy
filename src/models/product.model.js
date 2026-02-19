import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["Furniture", "Appliance"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      required: true,
      min: 0,
    },

    totalStock: {
      type: Number,
      required: true,
      min: 0,
    },

    availableStock: {
      type: Number,
      required: true,
      min: 0,
    },

    tenureOptions: {
      type: [Number], // example: [3, 6, 12]
      default: [3, 6, 12],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

productSchema.pre("save", function () {
  if (this.availableStock > this.totalStock) {
    return next(new Error("Available stock cannot exceed total stock"));
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
