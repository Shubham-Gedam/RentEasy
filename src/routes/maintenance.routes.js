import express from "express";
import * as maintenanceController from "../controllers/maintenance.controller.js";
import * as  authMiddleware from "../middlewares/auth.middlware.js";
import  adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// User
router.post("/", authMiddleware.protect, maintenanceController.createRequest);
router.get("/my", authMiddleware.protect, maintenanceController.getUserRequests);

// Admin
router.get("/", authMiddleware.protect, adminMiddleware, maintenanceController.getAllRequests);
router.put("/:id", authMiddleware.protect, adminMiddleware, maintenanceController.updateStatus);

export default router;
