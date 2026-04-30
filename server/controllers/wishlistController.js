exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();
  res.json(user.wishlist);
};
const User = require("../models/User");

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  res.json(user.wishlist);
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
};