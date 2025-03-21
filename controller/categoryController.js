const Category = require("../model/categoryModel");
const Food = require("../model/foodModel");

// get nested category
exports.getNestedCategories = async (parentId = null) => {
    const categories = await Category.find({ parentCategory: parentId }).populate("foods");
  
    const categoryList = await Promise.all(
      categories.map(async (category) => ({
        _id: category._id,
        name: category.name,
        description: category.description,
        foods: category.foods, 
        subcategories: await getNestedCategories(category._id)
      }))
    );
  
    return categoryList;
  };