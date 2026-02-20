import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as authMiddleware from '../middlewares/auth.middlware.js';

const router = express.Router();

// Sabhi routes sirf admin ke liye
router.use(authMiddleware.protect, authMiddleware.authorizeRoles('admin'));

// 1. Users Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
// router.put('/users/:id/block', adminController.blockUser); // optional, agar block feature chahiye
router.delete('/users/:id', adminController.deleteUser);

// 2. Rentals Monitoring
router.get('/rentals', adminController.getAllRentals);
// router.get('/rentals/:id', adminController.getRentalDetails);

// 3. Basic Reports / Summary
router.get('/reports/summary', adminController.getDashboardSummary);

// 4. Maintenance (already bana hai, lekin admin ke liye extra filter add kar sakte hain baad mein)

// 5. Damage Claims (future)
router.get('/damages', adminController.getAllDamages);

export default router;