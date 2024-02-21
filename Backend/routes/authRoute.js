const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const User = require("../models/userSchema");
const authMiddleware = require("../middlewares/is-auth");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail is already exist!");
          }
        });
      }),
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username is too short!")
      .isLength({ max: 15 })
      .withMessage("Username is too long!")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username is already exist!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password is too short!"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password is too short!"),
  ],
  authController.login
);

router.get("/status", authController.checkStatus);

module.exports = router;
