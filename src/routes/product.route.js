import express from "express";
import * as productController from "../controllers/product.controller.js";

import * as authMiddleware from "../middlewares/auth.middlware.js";

const router = express.Router();

// router.get("/", authMiddleware.getAllProducts);
// router.get("/:id", authMiddleware.getSingleProduct);

router.post("/create", authMiddleware.protect, authMiddleware.authorizeRoles("admin"), productController.createProduct);

router.put("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin"), productController.updateProduct);

router.delete("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin"), productController.deleteProduct);

export default router;
