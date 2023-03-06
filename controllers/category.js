const Category = require('../models/category');
// const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name.trim()) {
        return res.json({ error: "Name is required" });
      }
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.json({ error: "Already exists" });
      }
  
      const category = await new Category({ name, slug: slugify(name) }).save();
      res.json(category);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  };

  exports.update = async (req,res) => {
        try{
            //data receive 
            const {name} = req.body;
            const {categoryId} = req.params;

            const updateCategory = await Category.findByIdAndUpdate(
                categoryId,
                {
                    name,
                    slug:slugify(name)
                },
                {new:true}

            )
            res.json(updateCategory);
        }catch(err){
            console.log(err);
            res.status(400).json(err.message);
        }
  };

  exports.remove = async (req,res) => {
        try{
            const removed = await Category.findByIdAndDelete(req.params.categoryId);
            res.json(removed);
        }catch(err){
            console.log(err);
            res.status(500).json(err.message);
        }
  };

  exports.list = async(req,res) => {
        try{
            const allList = await Category.find({});
            res.json(allList);
        }catch(err){
            console.log(err);
            res.status(400).json(err.message);
        }
  };

  exports.read = async (req,res) => {
        try{
            const readFile = await Category.findOne({slug:req.Params.slug});
            res.json(readFile);
        }catch(err){
            console.log(err);
            res.status(400).json(err.message);
        }
  }
