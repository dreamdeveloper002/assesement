import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import mongoSanitize from "express-mongo-sanitize";
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import courierRoutes from './routes/courierRoutes.js'

dotenv.config()

connectDB()
 
const app = express();

app.use(express.json());


//Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    
    app.use(morgan('dev'));

}


//sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100
})

app.use(limiter);


// prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/courier', courierRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use(errorHandler);

app.use(notFound);

const PORT = process.env.PORT || 8040

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
});