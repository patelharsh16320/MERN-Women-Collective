const Category = require("../models/Category");

/* CREATE */
const createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const category = await Category.create({
      name,
      parent: parent || null,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name")
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ONE */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent");

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const children = await Category.find({ parent: category._id });

    res.json({ ...category.toObject(), children });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
const updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (parent && parent === req.params.id) {
      return res.status(400).json({ message: "Cannot be own parent" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parent },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
const deleteCategory = async (req, res) => {
  try {
    const deleteRecursive = async (id) => {
      const children = await Category.find({ parent: id });
      for (let child of children) {
        await deleteRecursive(child._id);
      }
      await Category.findByIdAndDelete(id);
    };

    await deleteRecursive(req.params.id);

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};