const express = require("express");
const { updateProfile, getAllUsers, promoteToAdmin, addCategory, updateCategory, getCategories } = require("../controller/profileController")
const { verifyUserToken, verifyAdminToken } = require("../middleware/verifyToken")

const router = express.Router();

// ✅ User routes
router.put("/profile", verifyUserToken, updateProfile);

// ✅ Admin routes
router.get("/users", verifyAdminToken, getAllUsers);
router.put("/promote/:userId", verifyAdminToken, promoteToAdmin);
router.post("/category", verifyAdminToken, addCategory);
router.put("/category/:categoryId", verifyAdminToken, updateCategory);

// ✅ Public menu
router.get("/categories", getCategories);

module.exports = router;
