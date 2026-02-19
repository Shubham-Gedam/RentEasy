import express from 'express';
import * as vendorController from "../controllers/vendor.conrtoller.js";
import * as authMiddlware from "../middlewares/auth.middlware.js";

const router = express.Router();

router.put("/rental/:id/delivery",authMiddlware.protect,authMiddlware.authorizeRoles("vendor"),vendorController.updateDeliveryStatus);

router.get("/maintenance",authMiddlware.protect,authMiddlware.authorizeRoles("vendor"),vendorController.getVendorMaintenance);



export default router;