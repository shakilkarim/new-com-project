const express =require("express");

const router = express.Router();
//Require middleware function from middleware folder
const { requireSignin, isAdmin } =require("../middlewares/auth.js");
const {create,update,remove,list,read} = require ('../controllers/category.js');

router.post('/category', requireSignin,isAdmin,create);
router.put('/category/:categoryId', requireSignin,isAdmin,update);
router.delete('/category/:categoryId', requireSignin,isAdmin,remove);
router.get('/categories', list);
router.get('/category/:slug', read);
module.exports = router;