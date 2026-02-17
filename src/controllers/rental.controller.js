import Rental from "../models/rental.model.js";
import Product from "../models/product.model.js";


// ✅ CREATE RENTAL
export async function createRentalController(req,res){
    const { productId, tenure, userId  } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ 
        message: "Product not found" 
        });
    }

    if (!product.tenureOptions.includes(tenure)) {
      return res.status(400).json({ 
        message: "Invalid tenure selected" 
        });
    }

    if (product.availableStock <= 0) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    const totalAmount = product.monthlyRent * tenure + product.securityDeposit;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + tenure);

    const rental = await Rental.create({
      user: userId,
      product: productId,
      tenure,
      endDate,
      totalAmount,
    });

    product.availableStock -= 1;
    await product.save();

    res.status(201).json({
      message: "Rental created successfully",
      rental,
    });
};



// ✅ RETURN RENTAL
export async function returnRentalController(req,res){

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (rental.status === "COMPLETED") {
      return res.status(400).json({ message: "Already returned" });
    }

    rental.status = "COMPLETED";
    await rental.save();

    // Increase stock back
    const product = await Product.findById(rental.product);
    product.availableStock += 1;
    await product.save();

    res.json({ message: "Rental returned successfully" });
};



// ✅ GET MY RENTALS
export async function getMyRentalsController(req, res) {
  try {
    
    const userId = req.user._id; 

    const rentals = await Rental.find({ user: userId }).populate("product");
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Auth failed or Server Error" });
  }
}
