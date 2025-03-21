const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

router.post("/", foodController.addFood);
router.get("/", foodController.getAllFood);
router.get("/category/:categoryId", foodController.getFoodByCategory);
router.put("/food/:foodId", verifyAdmin, updateFood);
router.delete("/food/:foodId", verifyAdmin, deleteFood);

module.exports = router;
