
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModels.js';



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



//@desc   Update order to paid
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


// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})


export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered, 
  createProductReview,
  getTopProducts
}