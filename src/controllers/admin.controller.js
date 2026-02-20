import User from '../models/user.model.js';
import Rental from '../models/rental.model.js';
import Product from '../models/product.model.js';
import Maintenance from '../models/maintenance.model.js';

// 1. All Users List
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v') // password hide karo
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const damages = await Rental.find({ damageReported: true })
      .populate('user', 'fullname email')
      .populate('product', 'name')
      .populate('vendor', 'fullname email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: damages.length,
      damages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};