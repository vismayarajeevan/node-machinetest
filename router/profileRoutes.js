const express = require("express");
const { updateProfile, getAllUsers, promoteToAdmin } = require("../controller/profileController")
const { verifyAdminToken } = require("../middleware/verifyToken")

const router = express.Router();

router.put("/profile", verifyAdminToken, updateProfile);
router.get("/users",verifyAdminToken, getAllUsers);
router.put("/promote/:userId",verifyAdminToken, promoteToAdmin);


module.exports = router;
