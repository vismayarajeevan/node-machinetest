const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

const { verifyAdminToken,verifyUserToken } = require("../middleware/verifyToken")

router.post("/",verifyAdminToken, foodController.addFood);
router.get("/",verifyAdminToken,verifyUserToken, foodController.getAllFood);
router.get("/category/:categoryId",verifyAdminToken, foodController.getFoodByCategory);
router.put("/food/:foodId",verifyAdminToken, foodController.updateFood);
router.delete("/food/:foodId",verifyAdminToken, foodController.deleteFood);

module.exports = router;
