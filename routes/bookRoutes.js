const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addBook,
  getBooks,
  getBookDetails,
  searchBooks,
} = require("../controllers/bookController");

router.post("/books", auth, addBook);
router.get("/books", getBooks);
router.get("/books/:id", getBookDetails);
router.get("/search", searchBooks);

module.exports = router;
