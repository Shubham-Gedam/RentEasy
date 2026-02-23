import Maintenance from "../models/maintenance.model.js";

/* ---------------- CREATE REQUEST ---------------- */
export const createRequest = async (req, res) => {
  try {
    const { rentalId, issueDescription, priority } = req.body;

    const request = await Maintenance.create({
      user: req.user.id,
      rental: rentalId,
      issueDescription,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request created",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
