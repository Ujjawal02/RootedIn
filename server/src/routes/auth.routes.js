const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { signupSchema, loginSchema } = require("../validations/auth.validation");
const validate = require("../middlewares/validate.middleware");
const { userVerification } = require("../middlewares/auth.middleware");

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/getme", userVerification, authController.getMe);

module.exports = router;