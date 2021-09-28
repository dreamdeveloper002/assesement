
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'
import Courier from '../models/courierModel.js';



//@desc   Courier login & get token
//@route  POST /api/courier/login
//@access Public
const courier =  asyncHandler(async (req, res) => {
  
  const { email, password } = req.body
   const courier = await Courier.findOne({ email});


   if( courier && (await courier.matchPassword(password))) {
       res.json ({
          _id : courier._id,
          firstName: courier.firstName,
          lastName: courier.lastName,
          verified: courier.verified,
          availabilityStatus: courier.availabilityStatus,
          ordersToDeliver: courier.ordersToDeliver,
          location: courier.location,
          email: courier.email, 
          phone: courier.phone,
          token: generateToken(user._id)
       });
   } else {
     res.status(401);
     throw new Error('Invalid email or password')
   }

});



//@desc   Register a new courier
//@route  POST /api/courier
//@access Public
const registerCourier =  asyncHandler(async (req, res) => {
  
  const { email, password, firstName, lastName, phone, address } = req.body
   const courierExists = await Courier.findOne({ email});


   if(courierExists) {
     res.status(400);
     throw new Error('Courier already exists')
   } 


   const courier = await Courier.create({
      firstName,
      lastName,
      email,
      password,
      phone
   });


   if(courier) {
      res.status(201).json({
        _id : courier._id,
        firstName: courier.firstName,
        lastName: courier.lastName,
        phone: courier.phone,
        address: courier.address,
        email: courier.email, 
        availabilityStatus: courier.availabilityStatus,
        ordersToDeliver: courier.ordersToDeliver,
        verified: courier.verified,
        token: generateToken(courier._id)
      })
   } else {
      console.log(error)
      res.status(400);
      throw new Error('Invalid courier data')
   }
});

export {
  courier,
  registerCourier
}