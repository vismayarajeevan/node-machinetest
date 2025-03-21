const User = require("../model/userModel");


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

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "userName email isAdmin");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};


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
