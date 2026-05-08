const Women = require('../models/Women');

// Get all
exports.getAllWomen = async (req, res, next) => {
  try {
    const women = await Women.find();
    res.json(women);
  } catch (err) {
    next(err);
  }
};

// Create
exports.createWoman = async (req, res, next) => {
  try {
    const woman = new Women(req.body);
    await woman.save();
    res.status(201).json(woman);
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateWoman = async (req, res, next) => {
  try {
    const woman = await Women.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(woman);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteWoman = async (req, res, next) => {
  try {
    await Women.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};