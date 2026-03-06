import express from 'express';
import * as vendorController from "../controllers/vendor.conrtoller.js";
import * as authMiddlware from "../middlewares/auth.middlware.js";

const router = express.Router();

router.put("/rental/:id/delivery",authMiddlware.protect,authMiddlware.authorizeRoles("vendor"),vendorController.updateDeliveryStatus);

router.get("/maintenance",authMiddlware.protect,authMiddlware.authorizeRoles("vendor"),vendorController.getVendorMaintenance);

router.get("/products", authMiddlware.protect, authMiddlware.authorizeRoles("vendor"), vendorController.getVendorProducts);

router.put("/rental/:id/pickup", authMiddlware.protect, authMiddlware.authorizeRoles("vendor"), vendorController.updatePickupDate);

router.put("/rental/:id/damage", authMiddlware.protect, authMiddlware.authorizeRoles("vendor"), vendorController.reportDamage);

// Isse baaki routes ke beech mein daal do
router.get("/rentals", authMiddlware.protect, authMiddlware.authorizeRoles("vendor"), vendorController.getVendorRentals);



export default router;