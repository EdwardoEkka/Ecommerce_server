const express = require('express');
const controller = require('../controller/controller');
const router=express.Router();
const cors = require("cors");
router.use(cors());
const authMiddleware = require('../middleware/authMiddleware');

router.post('/manual-sign_up',controller.manualSignUp);
router.post('/manual-sign_in',controller.manual_login);
router.get('/user-details', authMiddleware, controller.getUserDetails);
router.post('/addProduct',controller.addToCart);
router.get('/getCart/:userId',controller.getCart);
module.exports=router;