const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { verifyAdminToken } = require("../middleware/verifyToken")

router.post("/",verifyAdminToken, categoryController.addCategory);
router.get("/categories", categoryController.getCategories);
router.get("/:categoryId/foods",verifyAdminToken, categoryController.getCategoryFoods);
router.put("/category/:categoryId",verifyAdminToken, categoryController.updateCategory);
router.delete("/category/:categoryId",verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
