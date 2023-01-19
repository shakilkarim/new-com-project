const express = require('express')
const formidable =require("express-formidable");
const router = express.Router();
//Middleware
const {requireSignin,isAdmin} = require('../middlewares/auth');
//Controller
const {create,list, read, photo,remove,update} = require('../controllers/product');


router.post('/product',requireSignin,isAdmin,formidable(),create);
router.get('/products', list);
router.get('/product/:slug', read);
router.get('/product/photo/:productId', photo);
router.delete('/product/:productId', remove);
router.put('/product/:productId',formidable(), update);
                      
module.exports = router;