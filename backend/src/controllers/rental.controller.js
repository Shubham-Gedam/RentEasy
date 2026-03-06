import Rental from "../models/rental.model.js";
import Product from "../models/product.model.js";


// ✅ CREATE RENTAL
export async function createRentalController(req, res) {
  try {
    const { productId, tenure, deliveryDate, deliveryAddress } = req.body;

    // ← Extra validation (better error message)
    if (!deliveryDate || !deliveryAddress) {
      return res.status(400).json({ 
        message: "deliveryDate and deliveryAddress are required" 
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.vendor) {
      return res.status(400).json({ message: "Product has no vendor assigned" });
    }

    if (!product.tenureOptions.includes(tenure)) {
      return res.status(400).json({ message: "Invalid tenure selected" });
    }

    if (product.availableStock <= 0) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    // Calculate endDate safely
    const deliveryDateObj = new Date(deliveryDate);
    if (isNaN(deliveryDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid deliveryDate format. Use YYYY-MM-DD" });
    }

    const endDate = new Date(deliveryDateObj);
    endDate.setMonth(endDate.getMonth() + tenure);

    const totalAmount = product.monthlyRent * tenure + product.securityDeposit;

    const rental = await Rental.create({
      user: req.user._id,
      product: productId,
      vendor: product.vendor,    // ← yeh ab safe hai kyunki upar check kiya
      tenure,
      deliveryDate: deliveryDateObj,   // Date object bhej do (better)
      deliveryAddress,
      endDate,
      totalAmount,
    });

    product.availableStock -= 1;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      rental,
    });
  } catch (error) {
    console.error(error);   // ← terminal mein full stack dekhne ke liye
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

    // Product ko populate karna zaroori hai images ke liye
    const rentals = await Rental.find({ user: userId }).populate("product");

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals.map(r => ({
        id: r._id,
        // Product null ho sakta hai agar product delete ho gaya ho
        imageUrl: r.product?.images?.[0] || 'https://via.placeholder.com/150',
        productName: r.product?.name || "Product Unavailable",
        category: r.product?.category || "N/A",
        tenure: r.tenure || 0,
        // Dates ko safely handle karo
        startDate: r.startDate ? new Date(r.startDate).toISOString().split('T')[0] : "N/A",
        endDate: r.endDate ? new Date(r.endDate).toISOString().split('T')[0] : "N/A",
        totalAmount: r.totalAmount || 0,
        status: r.status || "PENDING",
        paymentStatus: r.paymentStatus || "UNPAID"
      }))
    });
  } catch (error) {
    console.error("Rental Fetch Error:", error);
    res.status(500).json({ message: "Server Error: Rental data fetch failed" });
  }
}