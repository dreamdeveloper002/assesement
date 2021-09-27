
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js';



//@desc   Auth user & get token
//@route  POST /api/users/login
//@access Public
const authUser =  asyncHandler(async (req, res) => {
  
  const { email, password } = req.body
   const user = await User.findOne({ email});


   if( user && (await user.matchPassword(password))) {
       res.json ({
          _id : user._id,
          name: user.name,
          email: user.email, 
          phone: user.phone,
          isAdmin: user.isAdmin,
          isCourier: user.isCourier,
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
         isCourier: user.isCourier,
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


export {
   authUser,
   getUserProfile,
   registerUser,
   updateUserProfile,
   deleteUser,
   getUserByID,
   getUsers,
   updateUser
}