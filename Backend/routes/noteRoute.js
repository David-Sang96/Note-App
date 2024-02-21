const express = require("express");
const noteController = require("../controllers/noteController");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/is-auth");

//GET /notes
router.get("/notes", noteController.getNotes);

//POST /create
router.post(
  "/create",
  authMiddleware,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short!")
      .isLength({ max: 60 })
      .withMessage("Title is too long!"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Content is too short!"),
  ],
  noteController.createNote
);

//GET /notes/:id
router.get("/notes/:id", noteController.getSingleNote);

//DELETE /delete/:id
router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

//GET /edit/:id
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

//PUT /edit/:id
router.put("/edit/:id", authMiddleware, noteController.updateNote);

module.exports = router;
