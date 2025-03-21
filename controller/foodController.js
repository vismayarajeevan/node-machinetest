const Food = require("../model/foodModel");
const Category = require("../model/categoryModel");

  exports.addFood = async (req, res) => {
    try {
      const { name, description, price, category } = req.body;

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      const newFood = new Food({ name, description, price, category });
      await newFood.save();

      existingCategory.foods.push(newFood._id);
      await existingCategory.save();

      res.status(201).json(newFood);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  exports.getAllFood =async (req, res) => {
    try {
      const foods = await Food.find().populate("category", "name description");
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  exports.getFoodByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const foods = await Food.find({ category: categoryId }).populate("category", "name description");
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


