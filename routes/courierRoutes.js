import express from 'express';
const router = express.Router();


import { courier, registerCourier } from "../controller/courierContoller";




router.route('/login')
      .post(courier);

router.route('/register')
      .post(registerCourier)
    

      
