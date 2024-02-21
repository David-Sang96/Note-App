const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 60,
    },
    content: {
      type: String,
      required: true,
      minLength: 5,
    },
    cover_image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("Note", noteSchema);

module.exports = noteModel;
