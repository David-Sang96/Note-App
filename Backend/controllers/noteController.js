const { validationResult } = require("express-validator");

// models
const Note = require("../models/noteSchema");

//utils
const fileDelete = require("../utils/unlink");

exports.getNotes = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const notesInPerPage = 6;
  let totalNotes;

  Note.find()
    .countDocuments()
    .then((counts) => {
      totalNotes = counts;
      return Note.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * notesInPerPage)
        .limit(notesInPerPage);
    })
    .then((notes) => {
      return res.status(200).json({
        notes,
        totalNotes,
        totalPages: Math.ceil(totalNotes / notesInPerPage),
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: "Cannot process the request!",
      });
    });
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const cover_image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed.",
      errorMessage: errors.array(),
    });
  }

  const newNote = new Note({
    title,
    content,
    cover_image: cover_image ? cover_image.path : "",
    author: req.userId,
  });
  newNote
    .save()
    .then((_) => {
      return res.status(201).json({
        message: "Note created.",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({
        message: "Cannot process the request!",
      });
    });
};

exports.getSingleNote = (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .populate("author", "username")
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Cannot process the request!",
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json("Auth failed!");
      }
      fileDelete(note.cover_image);
      return Note.findByIdAndDelete(id).then((_) => {
        return res.status(204).json({
          message: "Note deleted.",
        });
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: "Cannot process the request!",
      });
    });
};
exports.getOldNote = (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json("Auth failed!");
      }
      return res.status(200).json(note);
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Cannot process the request!",
      });
    });
};

exports.updateNote = (req, res, next) => {
  const { note_id, title, content } = req.body;
  const cover_image = req.file;

  Note.findById(note_id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json("Auth failed!");
      }
      note.title = title;
      note.content = content;
      if (cover_image) {
        fileDelete(note.cover_image);
        note.cover_image = cover_image.path;
      }
      return note.save();
    })
    .then((_) => {
      return res.status(201).json("Update Success!");
    })
    .catch((err) => {
      return res.status(404).json({
        message: "Cannot process the request!",
      });
    });
};
