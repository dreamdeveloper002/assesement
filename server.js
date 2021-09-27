import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()
 
const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(errorHandler);

app.use(notFound);

const PORT = process.env.PORT || 8040

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
});