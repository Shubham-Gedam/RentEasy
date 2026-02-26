import ImageKit from "imagekit";
import mongoose from "mongoose";
import config from "../config/config.js";

const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, folder = "products") {
    return new Promise((resolve, reject) => {
        // Galti yahan thi: fileName mein extension hona zaroori hai
        // file.originalname se extension nikal ke ObjectId ke saath jod diya
        const fileName = (new mongoose.Types.ObjectId()).toString() + "-" + file.originalname;

        imagekit.upload({
            file: file.buffer, // Direct buffer (multer memoryStorage)
            fileName: fileName, 
            folder: folder
        }, (error, result) => {
            if (error) {
                console.error("ImageKit Error Details:", error);
                reject(error);
            } else {
                // Return consistent object
                resolve({
                    url: result.url,
                    fileId: result.fileId,
                    thumbnailUrl: result.thumbnailUrl
                });
            }
        });
    });
}

export default uploadFile;