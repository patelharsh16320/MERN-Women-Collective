const Category = require("../models/Category");

/* Ensure 'General' exists */
const ensureGeneralCategory = async () => {
  let general = await Category.findOne({ name: "General", parent: null });

  if (!general) {
    general = await Category.create({
      name: "General",
      parent: null,
    });
    console.log("✅ Created 'General' category");
  }

  return general;
};

/* Set default parent */
const setDefaultParent = async (generalId) => {
  await Category.updateMany(
    {
      parent: null,
      name: { $ne: "General" },
    },
    {
      $set: { parent: generalId },
    }
  );
};

/* Prevent deletion */
const isGeneralCategory = async (id) => {
  const cat = await Category.findById(id);
  return cat && cat.name === "General" && cat.parent === null;
};

module.exports = {
  ensureGeneralCategory,
  setDefaultParent,
  isGeneralCategory,
};