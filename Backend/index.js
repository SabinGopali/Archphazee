import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userroute from './routes/user.route.js';
import authroute from './routes/auth.route.js'
import productroute from './routes/product.route.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// import cookieParser from 'cookie-parser';
// import applicationRouter from './routes/application.route.js';
// import bookingRouter from './routes/booking.route.js';

dotenv.config();

// Get dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO).then(
    () => {console.log('MongoDb is connected')}
).catch(err => {
    console.log(err);
})

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const productsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// app.use(cookieParser());

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/backend/user', userroute);
app.use('/backend/auth', authroute);
app.use('/backend/product', productroute);
// app.use('/api/application', applicationRouter);
// app.use('/api/booking', bookingRouter);

app.use ((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

app.listen(3000, () => {
    console.log('Server is running in port 3000');
})