// Ensure 'General' category exists
const { ensureGeneralCategory } = require("./utils/categoryGeneral");

ensureGeneralCategory();
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const path = require("path");
const express = require("express");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));