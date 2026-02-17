import mongoose from "mongoose";
import config from "../config/config.js";   


async function connectDB() {

    try {

        await mongoose.connect(config.MONGODB_URI)
        console.log("Connected to the database successfully");

    }catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

export default connectDB;