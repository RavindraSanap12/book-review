const Book = require("../models/Book");
const Review = require("../models/Review");

exports.addBook = async (req, res) => {
  try {
    const book = new Book({ ...req.body, addedBy: req.user.userId });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = genre;
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const reviews = await Review.find({ book: book._id }).populate(
      "user",
      "username"
    );
    const avgRating = reviews.length
      ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
      : 0;
    res.json({ book, avgRating, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: new RegExp(query, "i") },
        { author: new RegExp(query, "i") },
      ],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
