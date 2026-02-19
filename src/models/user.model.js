import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
