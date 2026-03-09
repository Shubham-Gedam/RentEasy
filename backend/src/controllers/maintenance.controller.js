import Maintenance from "../models/maintenance.model.js";
import Rental from "../models/rental.model.js"

/* ---------------- CREATE REQUEST ---------------- */
export const createRequest = async (req, res) => {
  try {
    const { rentalId, issueDescription, priority } = req.body;

    // 1. Validation check
    if (!rentalId || !issueDescription) {
      return res.status(400).json({ message: "Rental ID aur Description zaroori hai!" });
    }

    // 2. Rental aur Product ko dhundo (Vendor ID nikaalne ke liye)
    // IMPORTANT: Check karo ki 'req.user._id' hai ya 'req.user.id'
    const userId = req.user._id || req.user.id; 

    const rental = await Rental.findById(rentalId).populate("product");
    
    if (!rental) {
      return res.status(404).json({ message: "Rental record nahi mila!" });
    }

    // 3. Maintenance entry create karo
    // Note: 'vendor' field schema mein add ki hai na?
    const request = await Maintenance.create({
      user: userId,
      rental: rentalId,
      vendor: rental.product?.vendor, // Safe navigation operator use kiya hai
      issueDescription,
      priority: priority || "MEDIUM",
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      request,
    });

  } catch (error) {
    console.error("MAINTENANCE_CREATE_ERROR:", error); // Terminal mein error check karo
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

/* ---------------- GET USER REQUESTS ---------------- */
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ user: req.user.id })
      .populate("rental")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ADMIN: GET ALL ---------------- */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate("user")
      .populate("rental")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE STATUS ---------------- */
export const updateStatus = async (req, res) => {
  try {
    const { status, adminNotes, resolutionNotes } = req.body;

    // Pehle request find karo + populate karo
    const request = await Maintenance.findById(req.params.id)
      .populate({
        path: "rental",
        populate: {
          path: "product",
          select: "vendor name"  // sirf zaroori fields
        }
      });

    if (!request) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    // Vendor authorization check
    if (req.user.role === "vendor") {
      if (!request.rental?.product?.vendor) {
        return res.status(403).json({ message: "This request is not linked to any product/vendor" });
      }

      if (request.rental.product.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to update this maintenance request" });
      }
    }

    // Update fields (admin aur vendor dono ke liye)
    if (status) request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    if (resolutionNotes) request.resolutionNotes = resolutionNotes;

    await request.save();

    // Optional: updated request ko fir se populate karke return kar sakte ho
    const updatedRequest = await Maintenance.findById(req.params.id)
      .populate("rental")
      .populate("user");

    res.status(200).json({
      success: true,
      message: "Maintenance request updated",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Maintenance update error:", error);
    res.status(500).json({ message: error.message });
  }
};
