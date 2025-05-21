const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    const existing = await Review.findOne({
      book: req.params.id,
      user: req.user.userId,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });
    const review = new Review({
      ...req.body,
      book: req.params.id,
      user: req.user.userId,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
