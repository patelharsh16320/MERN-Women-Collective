const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: [1, "Price must be at least 1"],
    },

    sellPrice: {
      type: Number,
      default: null,
      min: [0, "Sell price cannot be negative"],
      validate: {
        validator: function (value) {
          // allow null (optional)
          if (value === null || value === undefined) return true;

          // must be less than price
          return value < this.price;
        },
        message: "Sell price must be less than regular price",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    countInStock: {
      type: Number,
      default: 1,
      min: [1, "Stock must be at least 1"],
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);