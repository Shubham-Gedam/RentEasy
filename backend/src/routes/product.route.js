import express from "express";
import * as productController from "../controllers/product.controller.js";

import * as authMiddleware from "../middlewares/auth.middlware.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);

router.post("/create", authMiddleware.protect, authMiddleware.authorizeRoles("admin","vendor"), productController.createProduct);

router.put("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin","vendor"), productController.updateProduct);

router.delete("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin","vendor"), productController.deleteProduct);

export default router;
