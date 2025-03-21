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



  exports.updateFood = async (req, res) => {
    try {
        const { foodId } = req.params;
        let { name, description, price, category } = req.body;

        // Check if the food item exists
        const existingFood = await Food.findById(foodId);
        if (!existingFood) {
            return res.status(404).json({ error: "Food item not found" });
        }

        // If category is not provided in the request, retain the existing one
        if (!category) {
            category = existingFood.category;
        } else {
            // Validate the new category if provided
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ error: "Invalid category ID" });
            }

            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ error: "Category not found" });
            }
        }

        // Update the food item
        const updatedFood = await Food.findByIdAndUpdate(
            foodId,
            { name, description, price, category },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const { foodId } = req.params;

        const existingFood = await Food.findById(foodId);
        if (!existingFood) {
            return res.status(404).json({ error: "Food item not found" });
        }

        // Remove the food item from its category
        await Category.updateOne(
            { _id: existingFood.category },
            { $pull: { foods: foodId } }
        );

        await Food.findByIdAndDelete(foodId);
        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
