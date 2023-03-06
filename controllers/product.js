const Product = require("../models/product");
const fs = require("fs");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.fields);
    console.log(req.files);
    //Data receive form user and data destructure fields value and file value!!
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    console.log("Photo ====", photo);

    //User data  validation because this is important
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1 mb size" });
    }

    //Create Product
    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//All products list show in users

exports.list = async (req, res) => {
  try {
    //All data find from database and show font end and user see logic
    const allProducts = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(allProducts);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//Read One Product

exports.read = async (req, res) => {
  try {
    //Find One Product read from database and show font end and see user
    const product = await Product.findOne({ slug: req.params.slug })
      //skip photo don't show
      .select("-photo")
      .populate("category");

    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//select photo

exports.photo = async (req, res) => {
  try {
    //Find By Id photo show user logic
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    //Check photo and font end response
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      res.set("Cross-Origin-Resource-Policy", "cross-origin")
      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//Delete data
exports.remove = async (req, res) => {
  try {
    //Individual data remove in database logic
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");

    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//Data update in database
exports.update = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
      case !description.trim():
        res.json({ error: "Description is required" });
      case !price.trim():
        res.json({ error: "Price is required" });
      case !category.trim():
        res.json({ error: "Category is required" });
      case !quantity.trim():
        res.json({ error: "Quantity is required" });
      case !shipping.trim():
        res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        res.json({ error: "Image should be less than 1mb in size" });
    }

    //update product
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      productUpdate.photo.data = fs.readFileSync(photo.path);
      productUpdate.photo.contentType = photo.type;
    }

    await productUpdate.save();
    res.json(productUpdate);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//Filtered Products
exports.filteredProducts = async (req, res) => {
  try {
        //Data receive req body 
        const {checked,radio} = req.body;

        let args = {};
        //Validation and conditional sort data 
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]};
        console.log('arg==>',args);
        //Then above data validation and conditional system base data find from database
        const products = await Product.find(args);
        console.log('Products ==> ', products);
        res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//All products count

exports.productsCount = async(req,res) => {
    try{
        //Total product show in font end from data find database 
        const totalCount = await Product.find({}).estimatedDocumentCount();
        res.json(totalCount);
    }catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

//List-Products show

exports.listProducts = async(req,res) => {
        try{
            //Product list show but limit page only six product and data receive in req params check 
            const perPage = 6;
            const page = req.params.page ? req.params.page : 1;

            //Above conditional system base data find and limited skip sort or photo don't show in font validation !!!
            const listProducts = await Product.find({})
                .select('-photo')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .sort({createAt: -1})

         res.json(listProducts) 
        }catch (err) {
            console.log(err);
            return res.status(400).json(err.message);
        }      
};

//Search products 
exports.searchProducts = async(req,res) => {
    try{
        const {keyword} = req.params;

        const result = await Product.find({
            $or:[
                {name:{$regex:keyword, $options: 'i'}},
                {description:{$regex:keyword, $options: 'i'}}
            ]
        }).select('-photo');

        res.json(result);        
    }catch (err) {
            console.log(err);
            return res.status(400).json(err.message);
    }  
};

//Related Products show 

exports.relatedProducts = async (req,res) => {
        try{
            //Data receive path param
            const{productId,categoryId} = req.params;
            
            const related = await Product.find({
                category:categoryId,
                _id:{$ne:categoryId}

            })
            .select('-photo')
            .populate(category)
            .limit(3)

            res.json(related);
        }catch (err) {
            console.log(err);
            return res.status(400).json(err.message);
        } 
}
