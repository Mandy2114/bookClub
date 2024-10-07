const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    require: true,
  },
  datePublished: {
    type: String,
    require: true,
  },
  pages: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  }
});

const Books = mongoose.model("Book", bookSchema);

module.exports = Books;