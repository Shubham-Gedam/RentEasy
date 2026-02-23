import express from "express";
import * as maintenanceController from "../controllers/maintenance.controller.js";
import * as authMiddleware from "../middlewares/auth.middlware.js";

const router = express.Router();

// User routes
router.post("/", authMiddleware.protect, maintenanceController.createRequest);
router.get("/my", authMiddleware.protect, maintenanceController.getUserRequests);

// Common route (admin + vendor dono access kar sake)
router.get("/", authMiddleware.protect, authMiddleware.authorizeRoles("admin", "vendor"), maintenanceController.getAllRequests);

router.put("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("admin", "vendor"),maintenanceController.updateStatus);

export default router;