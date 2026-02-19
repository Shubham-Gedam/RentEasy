import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import * as authMiddleware from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/", authMiddleware.protect, cartController.addToCart);
router.get("/", authMiddleware.protect, cartController.getCart);
router.delete("/:productId", authMiddleware.protect, cartController.removeFromCart);
router.delete("/", authMiddleware.protect, cartController.clearCart);
router.post("/checkout", authMiddleware.protect, cartController.checkout);


export default router;
