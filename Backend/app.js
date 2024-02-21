const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const noteRoutes = require("./routes/noteRoute");
const authRoutes = require("./routes/authRoute");
const multer = require("multer");

const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const fileFilterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single(
    "cover_image"
  )
);
app.use(cors());

app.use(noteRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then((_) => {
    console.log("Connected to database and running on PORT 5000");
    app.listen(5000);
  })
  .catch((err) => console.log(err));
