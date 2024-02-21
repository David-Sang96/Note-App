const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: "Validation failed!",
        errorMessage: errors.array(),
      });
    }
    const { email, password, username } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
    });
    return res
      .status(201)
      .json({ message: "User created!", userId: newUser._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed!",
        errorMessage: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      // throw new Error("Email does not exist!");
      return res.status(401).json({ message: "E-mail not exist!" });
    }
    const isMatch = bcrypt.compareSync(password, userDoc.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ token, userId: userDoc._id, username: userDoc.username });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.checkStatus = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Unauthorized." });
  const token = authHeader.split(" ")[1];
  try {
    const tokenMatch = jwt.verify(token, process.env.JWT_KEY);
    if (!tokenMatch) return res.status(401).json({ message: "Unauthorized" });
    req.userId = tokenMatch.userId;
    res.status(200).json("ok");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized." });
  }
};
