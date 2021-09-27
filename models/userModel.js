import mongoose from 'mongoose'

import bcrypt from 'bcryptjs';


const userSchema = mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
     minlength: 2 
    },
  lastName: { 
    type: String, 
    required: true, 
    minlength: 2
   },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
  phone: {
    type: String, 
    required: true, 
    unique: true, 
    minlength: 10,
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  isAdmin: {
    type: Boolean,
    require: true,
    default: false
  },
  isCourier: {
    type: Boolean,
    require: true,
    default: false
  },
}, {
  timestamps: true
})


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};


userSchema.pre('save', async function (next) {

   if(!this.isModified('password')) {
       next()
   };
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model('User', userSchema)


export default User