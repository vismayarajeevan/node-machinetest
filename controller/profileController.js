const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Food = require("../model/foodModel");

// ✅ Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { userName } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.userName = userName || user.userName;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

// ✅ Admin - Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "userName email isAdmin");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// ✅ Admin - Promote user to admin
exports.promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: "User promoted to admin", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to promote user", error: error.message });
    }
};

// ✅ Admin - Add a new menu category
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

// ✅ Admin - Edit a menu category
exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
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

// ✅ Public - Get all menu categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate("foods");
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
