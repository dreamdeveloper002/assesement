
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail';
const crypto = require('crypto');



//@desc   Auth user & get token
//@route  POST /api/users/login
//@access Public
const authUser =  asyncHandler(async (req, res) => {
  
  const { email, password } = req.body
   const user = await User.findOne({ email});


   if( user && (await user.matchPassword(password))) {
       res.json ({
          _id : user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email, 
          phone: user.phone,
          isAdmin: user.isAdmin,
          isDispatcher: user.isDispatcher,
          token: generateToken(user._id)
       });
   } else {
     res.status(401);
     throw new Error('Invalid email or password')
   }

});


//@desc   Register a new user
//@route  POST /api/users
//@access Public
const registerUser =  asyncHandler(async (req, res) => {
  
   const { email, password, firstName, lastName, phone } = req.body
    const userExists = await User.findOne({ email});
 
 
    if(userExists) {
      res.status(400);
      throw new Error('User already exists')
    } 


    const user = await User.create({
       firstName,
       lastName,
       email,
       password,
       phone
    });


    if(user) {
       res.status(201).json({
         _id : user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         phone: user.phone,
         email: user.email, 
         isAdmin: user.isAdmin,
         isDispatcher: user.isDispatcher,
         token: generateToken(user._id)
       })
    } else {
       console.log(error)
       res.status(400);
       throw new Error('Invalid user data')
    }
 
 });


//@desc   Get user profile
//@route  GET /api/users/profile
//@access Private
const getUserProfile =  asyncHandler(async (req, res) => {
  
    const user = await User.findById(req.user._id);
 
     if(user) {
      res.json ({
         _id : user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         phone: user.phone,
         email: user.email, 
         isAdmin: user.isAdmin,
         isCourier: user.isCourier,
      });
     } else {

      res.status(404);
      throw new Error('User not found')

     }
   
   }); 


//@desc     Update user profile
//@route  PUT /api/users/profile
//@access Private
const updateUserProfile =  asyncHandler(async (req, res) => {
  
   const user = await User.findById(req.user._id);

    if(user) {
     
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.email = req.body.email || user.email
      user.phone = req.body.phone || user.phone
      if(req.body.password) {
         user.password = req.body.password
      };

      const updatedUser = await user.save();

      res.json({

         _id : updatedUser._id,
         firstName: updatedUser.firstName,
         lastName: updatedUser.lastName,
         phone: updatedUser.phone,
         email: updatedUser.email, 
         isAdmin: updatedUser.isAdmin,
         isCourier:updatedUser.isCourier,
         token: generateToken(updatedUser._id)
      })
    } else {

     res.status(404);
     throw new Error('User not found')

    }
  
  }); 


//@desc   Get all users
//@route  GET /api/users
//@access Private/Admin
const getUsers =  asyncHandler(async (req, res) => {
  
   const users = await User.find({});
   
   res.json(users)
   
}); 


//@desc   Delete user
//@route  DELETE /api/users/:id
//@access Private/Admin
const deleteUser =  asyncHandler(async (req, res) => {
  
   const user = await User.findById(req.params.id);

   if(!user) {
      res.status(404);
      throw new Error('User not found')
   } else {
      await user.remove()
      res.json({ message: 'user successfully removed'})
   }
   
  }); 



//@desc   Get user by ID
//@route  GET /api/users/:id
//@access Private/Admin
const getUserByID =  asyncHandler(async (req, res) => {
  
   const user = await User.findById(req.user.id).select('-password');
   

   if(!user) {
      res.status(404);
      throw new Error('User not found')
   };

   res.json(user)
   
}); 



//@desc     Update user 
//@route  PUT /api/users/:id
//@access Private/Admin
const updateUser =  asyncHandler(async (req, res) => {
  
   const user = await User.findById(req.params.id);

    if(user) {
     
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.email = req.body.email || user.email
      user.phone = req.body.phone || user.phone
      user.isAdmin = req.body.isAdmin
      const updatedUser = await user.save();

      res.json({
         _id : updatedUser._id,
         firstName: updatedUser.firstName,
         lastName: updatedUser.lastName,
         phone: updatedUser.phone,
         email: updatedUser.email, 
         isAdmin: updatedUser.isAdmin,
         isCourier:updatedUser.isCourier,
      })
    } else {

     res.status(404);
     throw new Error('User not found')

    }
  
  }); 



//@desc   Forgot password
//@route  POST  /api/v1/auth/forgotpassword
//@access Public
const forgotPassword =  asyncHandler(async (req, res) => {
  
   const user = await User.findById({ email: req.body.email});

   if(!user) {
      res.status(404);
      throw new Error('User not found')
   };

   //Get reset token
  const resetToken = user.getResetPasswordToken();


// Create reset url
 const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;


 const message = `You are receiving this email because you have request for a password reset, please make a PUT request to: \n\n ${resetUrl}`;

  await user.save({ validateBeforeSave: false });


 await sendEmail({
   email: user.email,
   subject: 'Password reset token',
   message
 });


 return res.status(200).json({ success: true, data: 'Email sent'});
   
 
   
}); 


//@desc       Reset password
//@route      PUT /api/v1/auth/resetpassword/:resettoken
//@access     Public
const resetPassword =  asyncHandler(async (req, res) => {
  
  // Get hashed token
  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(req.params.resettoken)
  .digest('hex');

  const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
  });


  if(!user) {
   res.status(404);
   throw new Error('User not found')
};

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    const updatedUser = await user.save(); 
    
    res.json({
      user: updateUser,
      token: generateToken(updatedUser._id)
   })
   
}); 

export {
   authUser,
   getUserProfile,
   registerUser,
   updateUserProfile,
   deleteUser,
   getUserByID,
   getUsers,
   updateUser,
   forgotPassword,
   resetPassword
}