const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

/* CONTROLLERS */
const user = require("../controllers/userController");
const authController = require("../controllers/authController");
const product = require("../controllers/productController");
const cart = require("../controllers/cartController");
const order = require("../controllers/orderController");
const category = require("../controllers/categoryController");
const invoice = require("../controllers/invoiceController");
const userDetails = require("../controllers/userDetailsController");
const wishlist = require("../controllers/wishlistController");
const Category = require("../models/Category");

// ================= AUTH =================
router.post("/auth/signup", user.signup);
router.post("/auth/login", authController.login);

// ================= USERS =================
router.route("/users")
  .post(auth, admin, user.signup)
  .get(auth, admin, user.getUsers);

router.route("/users/:id")
  .get(auth, admin, user.getUserById)
  .put(auth, user.updateUser)
  .delete(auth, admin, user.deleteUser);

// ================= PRODUCTS =================
router.route("/products")
  .post(auth, admin, upload.single("image"), product.createProduct)
  .get(product.getProducts);

router.route("/products/:id")
  .get(product.getProductById)
  .put(auth, admin, upload.single("image"), product.updateProduct)
  .delete(auth, admin, product.deleteProduct);

// ================= CART =================
router.route("/cart")
  .get(auth, cart.getCart)
  .post(auth, cart.addToCart);

// ================= ORDERS =================
router.route("/orders")
  .post(auth, order.createOrder)
  .get(auth, order.getOrders);

router.get("/orders/:id", auth, order.getOrderById);

// ================= INVOICES =================
router.route("/invoices")
  .post(auth, invoice.createInvoice)
  .get(auth, invoice.getInvoices);

router.get("/invoices/:id", auth, invoice.getInvoiceById);

// ================= CATEGORY =================
router.route("/categories")
  .post(auth, admin, category.createCategory)
  .get(category.getCategories);

router.route("/categories/:id")
  .get(category.getCategoryById)
  .put(auth, admin, category.updateCategory)
  .delete(auth, admin, category.deleteCategory);

// ================= USER DETAILS =================
router.get("/user-details", auth, userDetails.getUserDetails);
router.post("/user-details/address", auth, userDetails.saveAddress);
router.post("/user-details/payment", auth, userDetails.addPaymentMethod);
router.get("/user-details/payments", auth, userDetails.getPaymentMethods);

// ================= WISHLIST =================
router.get("/wishlist", auth, wishlist.getWishlist);
router.post("/wishlist/add", auth, wishlist.addToWishlist);
router.post("/wishlist/remove", auth, wishlist.removeFromWishlist);

module.exports = router;