const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);

router.post("/login", userController.userLogin);

router.get("/user/:id", userController.getUserById);

router.put("/user/:id", userController.userUpdate);

module.exports = router;