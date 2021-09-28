import mongoose from 'mongoose'

import bcrypt from 'bcryptjs';


const courierSchema = mongoose.Schema({
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

  verified: { 
    type: Boolean,
    required: true, 
    default: false
  },

  availabilityStatus: {
    type: Boolean,
    default: true,
    required: true,
    select: false,
  },

  ordersToDeliver: [{
    orderId: {
      type: String,
      required: true
    },
    allocatedDispatcherId: {
      type: String,
      required: true
    },
    orderStatus: {
      type: String,
      require: true,
      enum: ['pending', 'delivered'],
      default: 'pending'
    }
  }],
  
  address: {
    type: String,
    required: [true, 'Please add an address']
  },

  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
})


courierSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};
  

  //Generate and hash password token
  courierSchema.methods.getResetPasswordToken = function () {
   // Generate token

   const resetToken = crypto.randomBytes(20).toString('hex');

   // Hash token and set reset to resetPasswordToken field
   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   //Set expire
   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

   return resetToken;
}

courierSchema.pre('save', async function (next) {

   if(!this.isModified('password')) {
       next()
   };
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


const Courier = mongoose.model('Courier', courierSchema)


export default Courier