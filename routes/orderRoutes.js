import express from 'express';
const router = express.Router();


import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, updateOrderToPaidPaystack} from "../controller/orderController.js";
import  { protect, admin } from '../middleware/authMiddleware.js';


router.route('/')
          .post(protect,addOrderItems)
          .get(protect, admin, getOrders);

router.route('/myorders')
          .get(protect, getMyOrders);

router.route('/:id')
          .get(protect,getOrderById);

router.route('/:id/pay')
          .put(protect,updateOrderToPaid)
          .put(protect,updateOrderToPaidPaystack);

router.route('/:id/deliver')
          .put(protect, admin, updateOrderToPaid);


export default router 