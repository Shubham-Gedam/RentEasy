import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import UserModel from '../models/user.model.js';

async function validate(req, res, next) {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    next();
}


export const registrationValidationRules = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required'),
    validate

]

export const loginValidationRules = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
]


export const protect = async (req, res, next) => {
  let token;

  // Token cookie se le (tera login/register mein 'token' cookie set kar raha hai)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // Ya header se (Bearer token) – future proof
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized - Please login" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // User fetch kar (password exclude)
    req.user = await UserModel.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Not authorized - Invalid/expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(", ")} allowed`
      });
    }

    next();
  };
};
