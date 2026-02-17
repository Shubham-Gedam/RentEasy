import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as validatonRule from '../middlewares/auth.middlware.js';
import passport from 'passport';


const router = express.Router();


router.post('/register', validatonRule.registrationValidationRules, authController.registerController);
router.post('/login', validatonRule.loginValidationRules, authController.loginController);


// Route to initiate Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleAuthCallback
);


export default router;