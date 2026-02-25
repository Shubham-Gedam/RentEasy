import ImageKit from "imagekit";
import mongoose from "mongoose";
import config from "../config/config.js"; // .js extension add kar le agar ES module hai

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a file buffer to ImageKit and returns the upload result
 * @param {Object} file - Multer file object (having .buffer and .originalname)
 * @param {string} [folder="RENTEASY"] - Optional folder name in ImageKit
 * @returns {Promise<Object>} - ImageKit upload response (contains url, fileId, etc.)
 * @throws {Error} If upload fails
 */
async function uploadFile(file, folder = "RENTEASY") {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file: buffer missing");
    }

    const uniqueFileName = `${new mongoose.Types.ObjectId().toString()}-${file.originalname}`;

    const result = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: file.buffer,
          fileName: uniqueFileName,
          folder: folder,
          
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      thumbnailUrl: result.thumbnailUrl || result.url,
    };
  } catch (error) {
    console.error("ImageKit upload failed:", error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

export default uploadFile;