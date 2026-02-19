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
    const { status, adminNotes } = req.body;

    const request = await Maintenance.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status || request.status;
    request.adminNotes = adminNotes || request.adminNotes;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Maintenance updated",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
