
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';



//@desc   Create new order
//@route  POST /api/orders
//@access Private
const addOrderItems =  asyncHandler(async (req, res) => {
 
   const { 

     orderItems, 
     shippingAddress,
     customerPhone,
     customerEmail, 
     paymentMethod, 
     itemsPrice,   
     taxPrice, 
     shippingPrice, 
     totalPrice
    
  } = req.body


  if(orderItems && orderItems.length === 0 ) {

     res.status(400);
     throw new Error('No order items');
     return

  } else {

    const order = new Order({
      orderItems, 
      user: req.user._id,
      shippingAddress, 
      paymentMethod,
      customerPhone,
      customerEmail, 
      itemsPrice, 
      taxPrice, 
      shippingPrice, 
      totalPrice
    });


    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }

});


//@desc   Get order by ID
//@route  GET /api/orders/:id
//@access Private
const getOrderById =  asyncHandler(async (req, res) => {
 
  const order = await Order.findById(req.params.id).populate('user','email')
  
  if(order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }

});



//@desc   Update order to paid *paypal*
//@route  PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid =  asyncHandler(async (req, res) => {
 
  const order = await Order.findById(req.params.id)
  
  if(order) {

    order.isPaid = true,
    order.paidAt = Date.now()
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404)
    throw new Error('Order not found')
  }

});


//@desc   Update order to paid  *Paystack*
//@route  PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaidPaystack =  asyncHandler(async (req, res) => {

  const PAYSTACK_BASE_URL = 'https://api.paystack.co/charge'
    const number = JSON.stringify(req.body.number)
    const cvv = JSON.stringify(req.body.cvv)
    const expiry_year = JSON.stringify(req.body.expiry_year)
    const expiry_month= JSON.stringify(req.body.expiry_month)
    const amount = req.body.amount
    const email = req.body.email_address
 

    const charge = await axios.post(PAYSTACK_BASE_URL, {
      card: {
        number,
        cvv,
        expiry_year,
        expiry_month,
      },
      email,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    const order = await Order.findById(req.params.id)
  
   if(order && charge.data.status === 'success') {

    order.isPaid = true,
    order.paidAt = Date.now()
    order.paymentResult = {
        id: charge.data.data.reference,
        status: charge.data.data.status,
        update_time: Date.now(),
        email_address: req.body.email_address
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404)
    throw new Error('Order not found')
  }

});


//@desc   Update order to delivered
//@route  PUT /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered =  asyncHandler(async (req, res) => {
 
  const order = await Order.findById(req.params.id)
  
  if(order) {

    order.isDelivered = true,
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404)
    throw new Error('Order not found')
  }

});




//@desc   Get logged in user orders
//@route  PUT /api/orders/myorders
//@access Private
const getMyOrders =  asyncHandler(async (req, res) => {
 
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)

});



//@desc   Get all orders
//@route  GET /api/orders
//@access Private/Admin
const getOrders =  asyncHandler(async (req, res) => {
 
  const orders = await Order.find({}).populate('user', 'id name')
  
  res.json(orders)

});




export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered, 
  updateOrderToPaidPaystack,
}