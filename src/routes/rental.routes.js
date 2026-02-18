import express from "express";
import * as rentalController  from "../controllers/rental.controller.js";
import { protect } from "../middlewares/auth.middlware.js";



const router = express.Router();

router.post("/", protect, rentalController.createRentalController);
router.put("/return/:id", protect, rentalController.returnRentalController);
router.get("/my-rentals", protect, rentalController.getMyRentalsController);

export default router;
