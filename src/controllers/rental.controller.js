import Rental from "../models/rental.model.js";
import Product from "../models/product.model.js";


// ✅ CREATE RENTAL
export async function createRentalController(req, res) {
  try {
    const { productId, tenure, deliveryDate, deliveryAddress } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.tenureOptions.includes(tenure)) {
      return res.status(400).json({ message: "Invalid tenure selected" });
    }

    if (product.availableStock <= 0) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    // ✅ Calculate total amount
    const totalAmount =
      product.monthlyRent * tenure + product.securityDeposit;

    // ✅ Calculate end date from delivery date
    const endDate = new Date(deliveryDate);
    endDate.setMonth(endDate.getMonth() + tenure);

    // ✅ Create rental with vendor snapshot
    const rental = await Rental.create({
      user: req.user._id,        
      product: productId,
      vendor: product.vendor,   
      tenure,
      deliveryDate,
      deliveryAddress,
      endDate,
      totalAmount,
    });

    // ✅ Reduce stock
    product.availableStock -= 1;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




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
    res.status(200).json({
  success: true,
  count: rentals.length,
  activeCount: rentals.filter(r => r.status === 'ACTIVE').length,
  data: rentals.map(r => ({
    id: r._id,
    productName: r.product.name,
    category: r.product.category,
    tenure: r.tenure,
    startDate: r.startDate.toISOString().split('T')[0],
    endDate: r.endDate.toISOString().split('T')[0],
    totalAmount: r.totalAmount,
    status: r.status,
    paymentStatus: r.paymentStatus
  }))
});
  } catch (error) {
    res.status(500).json({ message: "Auth failed or Server Error" });
  }
}
