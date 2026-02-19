import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config/config.js';
import morgan from 'morgan';


import authRoutes from './routes/auth.route.js';
import rentalRoutes from './routes/rental.routes.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from "./routes/cart.route.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import vendorRoutes from './routes/vendor.route.js'



const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalRoutes)
app.use('/api/products', productRoutes)
app.use("/api/cart", cartRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use('/api/vendor', vendorRoutes)


export default app;