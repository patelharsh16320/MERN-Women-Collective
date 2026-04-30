const UserDetails = require("../models/UserDetails");

// GET
exports.getUserDetails = async (req, res) => {
  const details = await UserDetails.findOne({ user: req.user._id });
  res.json(details);
};

// SAVE ADDRESS
exports.saveAddress = async (req, res) => {
  const { address } = req.body;

  let details = await UserDetails.findOne({ user: req.user._id });

  if (!details) {
    details = await UserDetails.create({
      user: req.user._id,
      address,
    });
  } else {
    details.address = address;
    await details.save();
  }

  res.json(details);
};

// ADD PAYMENT
exports.addPaymentMethod = async (req, res) => {
  const { type, details } = req.body;

  let userDetails = await UserDetails.findOne({ user: req.user._id });

  if (!userDetails) {
    userDetails = await UserDetails.create({
      user: req.user._id,
      paymentMethods: [{ type, details }],
    });
  } else {
    userDetails.paymentMethods.push({ type, details });
    await userDetails.save();
  }

  res.json(userDetails);
};

// GET PAYMENTS
exports.getPaymentMethods = async (req, res) => {
  const userDetails = await UserDetails.findOne({ user: req.user._id });
  res.json(userDetails?.paymentMethods || []);
};