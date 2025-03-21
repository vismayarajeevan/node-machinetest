const Category = require("../model/categoryModel");


exports.getNestedCategories = async (parentId = null) => {
    const categories = await Category.find({ parentCategory: parentId }).populate("foods");
  
    const categoryList = await Promise.all(
      categories.map(async (category) => ({
        _id: category._id,
        name: category.name,
        description: category.description,
        foods: category.foods, 
        subcategories: await exports.getNestedCategories(category._id) 
      }))
    );
  
    return categoryList;
};


exports.addCategory = async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;
        const newCategory = new Category({ name, description, parentCategory });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCategories = async (req, res) => {
    try {
        const hierarchicalCategories = await exports.getNestedCategories(); 
        res.status(200).json(hierarchicalCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCategoryFoods = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).populate("foods");

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(category.foods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description, parentCategory } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description, parentCategory },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find category to delete
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Recursively delete all subcategories
        const deleteSubcategories = async (parentId) => {
            const subcategories = await Category.find({ parentCategory: parentId });
            for (let subcategory of subcategories) {
                await deleteSubcategories(subcategory._id);
                await Category.findByIdAndDelete(subcategory._id);
            }
        };

        await deleteSubcategories(categoryId);
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ message: "Category and its subcategories deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
