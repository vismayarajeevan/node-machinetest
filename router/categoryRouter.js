const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/", categoryController.addCategory);
router.get("/", categoryController.getCategories);
router.get("/:categoryId/foods", categoryController.getCategoryFoods);

module.exports = router;
