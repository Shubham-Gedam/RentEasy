import Rental from "../models/rental.model.js";
import Maintenance from "../models/maintenance.model.js";
import Product from "../models/product.model.js";   // ← yeh line daal

/* ---------------- UPDATE DELIVERY STATUS ---------------- */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;

    const rental = await Rental.findById(req.params.id).populate("product");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (!rental.product.vendor) {
      return res.status(400).json({ message: "Vendor not linked to product" });
    }

    if (rental.product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    rental.deliveryStatus = deliveryStatus;
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Delivery status updated",
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET VENDOR MAINTENANCE ---------------- */
export const getVendorMaintenance = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate({
        path: "rental",
        populate: {
          path: "product",
          match: { vendor: req.user._id },
        },
      })
      .sort({ createdAt: -1 });

    const filtered = requests.filter((r) => r.rental?.product);

    res.status(200).json({
      success: true,
      count: filtered.length,
      requests: filtered,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- REPORT DAMAGE ---------------- */
export const reportDamage = async (req, res) => {
  try {
    const { damageNotes } = req.body;

    const rental = await Rental.findById(req.params.id).populate("product");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (rental.product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    rental.damageReported = true;
    rental.damageNotes = damageNotes;
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Damage recorded",
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ----------------  VENDOR PRODUCT LIST ---------------- */
export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id })
      .sort({ createdAt: -1 })
      .select('name category monthlyRent securityDeposit availableStock city');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePickupDate = async (req, res) => {
  try {
    const { pickupDate } = req.body;

    if (!pickupDate) {
      return res.status(400).json({ message: "pickupDate is required (YYYY-MM-DD format)" });
    }

    const rental = await Rental.findById(req.params.id).populate("product");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (!rental.product.vendor) {
      return res.status(400).json({ message: "Vendor not linked to product" });
    }

    if (rental.product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const pickupDateObj = new Date(pickupDate);
    if (isNaN(pickupDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid pickupDate format" });
    }

    if (pickupDateObj < new Date()) {
      return res.status(400).json({ message: "Pickup date cannot be in the past" });
    }

    rental.pickupDate = pickupDateObj;
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Pickup date updated successfully",
      rental,
    });
  } catch (error) {
    console.error("Pickup update error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getVendorRentals = async (req, res) => {
  try {
    // Sirf wahi rentals dikhao jahan product ka vendor current logged-in user (vendor) ho
    const rentals = await Rental.find({ vendor: req.user._id })
      .populate("user", "fullname email")
      .populate("product", "name images");

    res.status(200).json({
      success: true,
      rentals
    });
  } catch (error) {
    console.error("Vendor Rental Fetch Error:", error);
    res.status(500).json({ message: "Rentals fetch karne mein error aaya" });
  }
};