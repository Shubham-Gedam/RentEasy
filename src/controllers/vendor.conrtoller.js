import Rental from "../models/rental.model.js";
import Maintenance from "../models/maintenance.model.js";

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
