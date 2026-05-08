const Wishlist = require('../models/Wishlist');

exports.getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate('user').populate('products');
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createWishlist = async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body);
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id).populate('user').populate('products');
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    res.json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    res.json({ message: 'Wishlist deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
