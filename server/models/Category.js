const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ MULTIPLE PARENTS SUPPORT
    parent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);