const express = require("express");
const router = express.Router();

// const User = require("../models/user.js");
const Book = require("../models/book.js");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.render("book/list-of-all-books.ejs", { books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // List out all the books and render list-of-all-books.ejs

router.get("/create", (req, res) => {
  console.log("hellllllppp");
  res.render("book/create.ejs");
});

router.get("/:bookId", async (req, res) => {
  let { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.render("show-book.ejs", { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // book show page (find book by id), render show-book.ejs

router.get("/:bookId/edit", async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  res.render("book/edit.ejs", { book });
});

router.put("/:bookId/edit", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.bookId, req.body);
  res.redirect(`books/${req.params.bookId}`);
});

router.post("/", async (req, res) => {
  await Book.create(req.body);
  res.redirect("books");
});

router.delete("/:bookId", async (req, res) => {
  try {
    const deleteBook = await Book.findByIdAndDelete(req.params.bookId);
    
    if (!deleteBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal Server Error"})
  }
});
module.exports = router;
