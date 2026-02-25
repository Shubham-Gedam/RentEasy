import express from "express";
import * as productController from "../controllers/product.controller.js";
import * as authMiddleware from "../middlewares/auth.middlware.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);

router.post("/create",authMiddleware.protect,authMiddleware.authorizeRoles("admin", "vendor"),upload.array("images", 5), productController.createProduct);

router.put("/:id",authMiddleware.protect,authMiddleware.authorizeRoles("admin", "vendor"),upload.array("images", 5),productController.updateProduct);

router.delete("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin","vendor"), productController.deleteProduct);

export default router;
