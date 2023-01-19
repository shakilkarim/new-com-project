const express = require('express')
const formidable =require("express-formidable");
const router = express.Router();
//Middleware
const {requireSignin,isAdmin} = require('../middlewares/auth');
//Controller
const {create,list, read, photo,remove,update,filteredProducts,productsCount,listProducts,searchProducts,relatedProducts} = require('../controllers/product');


router.post('/product',requireSignin,isAdmin,formidable(),create);
router.get('/products', list);
router.get('/product/:slug', read);
router.get('/product/photo/:productId', photo);
router.delete('/product/:productId', remove);
router.put('/product/:productId',formidable(), update);
router.post('/filtered-products', filteredProducts);
router.get('/products-count', productsCount);
router.get('/list-product/:page', listProducts);
router.get('/products/search/:keyword', searchProducts);
router.get('/related-products/:productId/:categoryId', relatedProducts);                      
module.exports = router;