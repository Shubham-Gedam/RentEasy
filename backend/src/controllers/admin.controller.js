import User from '../models/user.model.js';
import Rental from '../models/rental.model.js';
import Product from '../models/product.model.js';
import Maintenance from '../models/maintenance.model.js';

// 1. All Users List
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;  // ?role=user or ?role=vendor

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('fullname email role createdAt')  // password mat bhejna
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Admin getAllUsers error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// 2. Update User Role (user → vendor → admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed: user, vendor, admin' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. All Rentals List (admin monitor ke liye)
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'fullname email')
      .populate('product', 'name category monthlyRent vendor')
      .populate('vendor', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Dashboard Summary Report (basic analytics)
export const getDashboardSummary = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalVendors: await User.countDocuments({ role: 'vendor' }),
      totalProducts: await Product.countDocuments(),
      lowStockProducts: await Product.countDocuments({ availableStock: { $lte: 2 } }),
      activeRentals: await Rental.countDocuments({ status: 'ACTIVE' }),
      pendingRentals: await Rental.countDocuments({ paymentStatus: 'Pending' }),
      pendingMaintenance: await Maintenance.countDocuments({ status: 'PENDING' }),
      resolvedMaintenance: await Maintenance.countDocuments({ status: 'RESOLVED' }),
      totalRevenue: await Rental.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]).then(result => result[0]?.total || 0),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Damage Claims List (basic)
export const getAllDamages = async (req, res) => {
  try {
    const { status } = req.query;  // optional filter (e.g. ?status=pending)

    const filter = { damageReported: true };
    if (status) filter.damageStatus = status;  // agar damageStatus field hai to

    const damages = await Rental.find(filter)
      .populate("user", "fullname email")
      .populate("product", "name category monthlyRent images")
      .populate("vendor", "fullname email")  // agar vendor separate field hai
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: damages.length,
      damages
    });
  } catch (error) {
    console.error("Admin getAllDamages error:", error);
    res.status(500).json({ message: "Server error while fetching damage claims" });
  }
};

// Admin: Get ALL Maintenance Requests (sab requests, populated)
export const getAllMaintenance = async (req, res) => {
  try {
    const { status, priority } = req.query;  // optional filters

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const requests = await Maintenance.find(filter)
      .populate({
        path: "rental",
        populate: {
          path: "product",
          select: "name category vendor monthlyRent"
        }
      })
      .populate("user", "fullname email")  // user ka naam/email
      .sort({ createdAt: -1 })
      .lean();  // faster response

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Admin getAllMaintenance error:", error);
    res.status(500).json({ message: "Server error while fetching maintenance requests" });
  }
};


// Toggle Block / Unblock User (isActive field assume kar ke – agar nahi hai to schema mein add kar)
export const toggleUserBlock = async (req, res) => {
  try {
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ message: "isBlocked must be true or false" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot block yourself" });
    }

    user.isActive = !isBlocked;  // true = active, false = blocked
    await user.save();

    res.status(200).json({
      success: true,
      message: isBlocked ? "User blocked" : "User unblocked",
      user: { id: user._id, fullname: user.fullname, email: user.email, isActive: user.isActive }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get Single Rental Details (full populated)
export const getRentalDetails = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate({
        path: "product",
        select: "name category monthlyRent securityDeposit totalStock availableStock tenureOptions city images vendor"
      })
      .populate("user", "fullname email phone role")  // user details
      .populate("vendor", "fullname email")           // vendor details (agar separate vendor field hai)
      .lean();  // faster response

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.status(200).json({
      success: true,
      rental
    });
  } catch (error) {
    console.error("Admin getRentalDetails error:", error);
    res.status(500).json({ message: "Server error while fetching rental details" });
  }
};

export const resolveDamageClaim = async (req, res) => {
  try {
    const { approved, adminNotes } = req.body;

    const rental = await Rental.findById(req.params.rentalId);

    if (!rental || !rental.damageReported) {
      return res.status(404).json({ message: "Damage claim not found or not reported" });
    }

    rental.damageApproved = approved;  // new field (schema mein add kar le)
    rental.damageAdminNotes = adminNotes;
    await rental.save();

    res.status(200).json({
      success: true,
      message: approved ? "Damage claim approved" : "Damage claim rejected",
      rental
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
