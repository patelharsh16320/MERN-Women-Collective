const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["stripe", "cod"], required: true },
  details: Object,
  createdAt: { type: Date, default: Date.now },
});

const userDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    address: String,
    paymentMethods: [paymentMethodSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDetails", userDetailsSchema);