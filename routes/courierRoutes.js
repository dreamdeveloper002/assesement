import express from 'express';
const router = express.Router();


import { courier, registerCourier } from "../controller/courierContoller.js";




router.route('/login')
      .post(courier);

router.route('/register')
      .post(registerCourier)
    

      
