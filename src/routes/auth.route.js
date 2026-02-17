import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as validatonRule from '../middlewares/auth.middlware.js';


const router = express.Router();


router.post('/register', validatonRule.registrationValidationRules, authController.registerController);
router.post('/login', validatonRule.loginValidationRules, authController.loginController);




export default router;