const Category = require("../models/Category");

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    // Prevent duplicate
    const exists = await Category.findOne({
      name: name.trim(),
      parent: parent || null,
    });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      parent: parent || null,
    });

    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id).populate("parent");
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const exists = await Category.findOne({
      name: name.trim(),
      parent: parent || null,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        parent: parent || null,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};