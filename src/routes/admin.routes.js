import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as authMiddleware from '../middlewares/auth.middlware.js';

const router = express.Router();


router.use(authMiddleware.protect, authMiddleware.authorizeRoles('admin'));

// 1. Users Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/block', adminController.toggleUserBlock);
router.delete('/users/:id', adminController.deleteUser);

// 2. Rentals Monitoring
router.get('/rentals', adminController.getAllRentals);
router.get('/rentals/:id', adminController.getRentalDetails);

// 3. Maintenance (all requests for admin)
router.get('/maintenance', adminController.getAllMaintenance);

// 4. Damage Claims (future-proof)
router.get('/damages', adminController.getAllDamages);

// 5. Basic Reports / Summary
router.get('/reports/summary', adminController.getDashboardSummary);

router.put('/damages/:rentalId/resolve', adminController.resolveDamageClaim);

export default router;