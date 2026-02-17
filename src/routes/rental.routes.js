import express from "express";
import * as rentalController  from "../controllers/rental.controller.js";



const router = express.Router();

router.post("/",  rentalController.createRentalController);
router.put("/return/:id", rentalController.returnRentalController);
router.get("/my-rentals", rentalController.getMyRentalsController);

export default router;
