const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Invoice = require('../models/Invoice');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collection_hub';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await Order.deleteMany();
  await Wishlist.deleteMany();
  await Invoice.deleteMany();


  // Categories
  const categories = await Category.insertMany([
    { name: 'Electronics' },
    { name: 'Furniture' },
    { name: 'Clothing' },
    { name: 'Books' },
    { name: 'Toys' },
    { name: 'Sports' },
    { name: 'Beauty' },
    { name: 'Automotive' },
    { name: 'Garden' },
    { name: 'Music' },
    { name: 'Grocery' },
    { name: 'Health' }
  ]);

  // Users
  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
    { name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password', role: 'user' },
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'password', role: 'user' },
    { name: 'Bob Brown', email: 'bob@example.com', password: 'password', role: 'user' },
    { name: 'Charlie Green', email: 'charlie@example.com', password: 'password', role: 'user' },
    { name: 'David Lee', email: 'david@example.com', password: 'password', role: 'user' },
    { name: 'Eva White', email: 'eva@example.com', password: 'password', role: 'user' },
    { name: 'Frank Black', email: 'frank@example.com', password: 'password', role: 'user' },
    { name: 'Grace King', email: 'grace@example.com', password: 'password', role: 'user' },
    { name: 'Henry Scott', email: 'henry@example.com', password: 'password', role: 'user' },
    { name: 'Ivy Adams', email: 'ivy@example.com', password: 'password', role: 'user' },
    { name: 'Jack Turner', email: 'jack@example.com', password: 'password', role: 'user' }
  ]);

  // Products
  const products = await Product.insertMany([
    { name: 'Modern Chair', price: 2599, company: 'ChairCo', colors: ['red', 'blue'], featured: true, stock: 10, description: 'A stylish modern chair.', category: categories[1]._id },
    { name: 'Smartphone', price: 15999, company: 'PhoneInc', colors: ['black'], featured: false, stock: 25, description: 'Latest smartphone.', category: categories[0]._id },
    { name: 'Classic Sofa', price: 8999, company: 'SofaWorld', colors: ['grey'], featured: true, stock: 5, description: 'Comfortable classic sofa.', category: categories[1]._id },
    { name: 'Running Shoes', price: 2999, company: 'Sporty', colors: ['white', 'blue'], featured: false, stock: 20, description: 'Lightweight running shoes.', category: categories[5]._id },
    { name: 'Bluetooth Speaker', price: 1999, company: 'SoundMax', colors: ['black'], featured: true, stock: 15, description: 'Portable Bluetooth speaker.', category: categories[9]._id },
    { name: 'Novel Book', price: 499, company: 'BookHouse', colors: [], featured: false, stock: 50, description: 'Bestselling novel.', category: categories[3]._id },
    { name: 'Toy Car', price: 299, company: 'ToyFun', colors: ['red', 'yellow'], featured: false, stock: 30, description: 'Fun toy car for kids.', category: categories[4]._id },
    { name: 'Lipstick', price: 199, company: 'BeautyPro', colors: ['pink', 'red'], featured: true, stock: 40, description: 'Long-lasting lipstick.', category: categories[6]._id },
    { name: 'Guitar', price: 4999, company: 'MusicMan', colors: ['brown'], featured: false, stock: 8, description: 'Acoustic guitar.', category: categories[9]._id },
    { name: 'Organic Apples', price: 299, company: 'FreshFarm', colors: [], featured: false, stock: 100, description: 'Fresh organic apples.', category: categories[10]._id },
    { name: 'Yoga Mat', price: 799, company: 'HealthFit', colors: ['green', 'purple'], featured: true, stock: 18, description: 'Non-slip yoga mat.', category: categories[11]._id },
    { name: 'Garden Shovel', price: 399, company: 'GardenTools', colors: ['green'], featured: false, stock: 12, description: 'Durable garden shovel.', category: categories[8]._id },
    { name: 'Car Vacuum', price: 1299, company: 'AutoClean', colors: ['black'], featured: false, stock: 7, description: 'Handheld car vacuum cleaner.', category: categories[7]._id },
    { name: 'T-shirt', price: 599, company: 'Clothify', colors: ['white', 'black'], featured: false, stock: 60, description: 'Comfortable cotton t-shirt.', category: categories[2]._id },
    { name: 'Basketball', price: 899, company: 'Sporty', colors: ['orange'], featured: true, stock: 22, description: 'Official size basketball.', category: categories[5]._id }
  ]);

  // Orders
  const orders = await Order.insertMany([
    { user: users[1]._id, items: [{ product: products[0]._id, qty: 1, price: 2599 }], total: 2599, address: '123 Main St', payment: 'Cash on Delivery', status: 'pending' },
    { user: users[2]._id, items: [{ product: products[2]._id, qty: 2, price: 8999 }], total: 17998, address: '456 Oak Ave', payment: 'Credit Card', status: 'shipped' },
    { user: users[3]._id, items: [{ product: products[3]._id, qty: 1, price: 2999 }], total: 2999, address: '789 Pine Rd', payment: 'UPI', status: 'delivered' },
    { user: users[4]._id, items: [{ product: products[4]._id, qty: 1, price: 1999 }], total: 1999, address: '321 Maple St', payment: 'Cash on Delivery', status: 'pending' },
    { user: users[5]._id, items: [{ product: products[5]._id, qty: 3, price: 499 }], total: 1497, address: '654 Cedar Ave', payment: 'Credit Card', status: 'pending' },
    { user: users[6]._id, items: [{ product: products[6]._id, qty: 2, price: 299 }], total: 598, address: '987 Birch Rd', payment: 'UPI', status: 'pending' },
    { user: users[7]._id, items: [{ product: products[7]._id, qty: 1, price: 199 }], total: 199, address: '159 Spruce St', payment: 'Cash on Delivery', status: 'pending' },
    { user: users[8]._id, items: [{ product: products[8]._id, qty: 1, price: 4999 }], total: 4999, address: '753 Willow Ave', payment: 'Credit Card', status: 'pending' },
    { user: users[9]._id, items: [{ product: products[9]._id, qty: 10, price: 299 }], total: 2990, address: '852 Aspen Rd', payment: 'UPI', status: 'pending' },
    { user: users[10]._id, items: [{ product: products[10]._id, qty: 1, price: 799 }], total: 799, address: '951 Poplar St', payment: 'Cash on Delivery', status: 'pending' },
    { user: users[11]._id, items: [{ product: products[11]._id, qty: 1, price: 399 }], total: 399, address: '357 Redwood Ave', payment: 'Credit Card', status: 'pending' },
    { user: users[12]._id, items: [{ product: products[12]._id, qty: 1, price: 1299 }], total: 1299, address: '258 Cypress Rd', payment: 'UPI', status: 'pending' },
    { user: users[0]._id, items: [{ product: products[13]._id, qty: 2, price: 599 }], total: 1198, address: '147 Palm St', payment: 'Cash on Delivery', status: 'pending' },
    { user: users[1]._id, items: [{ product: products[14]._id, qty: 1, price: 899 }], total: 899, address: '369 Magnolia Ave', payment: 'Credit Card', status: 'pending' }
  ]);

  // Wishlists
  await Wishlist.insertMany([
    { user: users[1]._id, products: [products[1]._id, products[2]._id, products[3]._id] },
    { user: users[2]._id, products: [products[4]._id, products[5]._id] },
    { user: users[3]._id, products: [products[6]._id] },
    { user: users[4]._id, products: [products[7]._id, products[8]._id] },
    { user: users[5]._id, products: [products[9]._id] },
    { user: users[6]._id, products: [products[10]._id, products[11]._id] },
    { user: users[7]._id, products: [products[12]._id] },
    { user: users[8]._id, products: [products[13]._id, products[14]._id] },
    { user: users[9]._id, products: [products[0]._id] },
    { user: users[10]._id, products: [products[1]._id, products[2]._id] }
  ]);

  // Invoices
  await Invoice.insertMany([
    { user: users[1]._id, order: orders[0]._id, total: 2599, items: [{ name: 'Modern Chair', qty: 1, price: 2599 }], payment: 'Cash on Delivery' },
    { user: users[2]._id, order: orders[1]._id, total: 17998, items: [{ name: 'Classic Sofa', qty: 2, price: 8999 }], payment: 'Credit Card' },
    { user: users[3]._id, order: orders[2]._id, total: 2999, items: [{ name: 'Running Shoes', qty: 1, price: 2999 }], payment: 'UPI' },
    { user: users[4]._id, order: orders[3]._id, total: 1999, items: [{ name: 'Bluetooth Speaker', qty: 1, price: 1999 }], payment: 'Cash on Delivery' },
    { user: users[5]._id, order: orders[4]._id, total: 1497, items: [{ name: 'Novel Book', qty: 3, price: 499 }], payment: 'Credit Card' },
    { user: users[6]._id, order: orders[5]._id, total: 598, items: [{ name: 'Toy Car', qty: 2, price: 299 }], payment: 'UPI' },
    { user: users[7]._id, order: orders[6]._id, total: 199, items: [{ name: 'Lipstick', qty: 1, price: 199 }], payment: 'Cash on Delivery' },
    { user: users[8]._id, order: orders[7]._id, total: 4999, items: [{ name: 'Guitar', qty: 1, price: 4999 }], payment: 'Credit Card' },
    { user: users[9]._id, order: orders[8]._id, total: 2990, items: [{ name: 'Organic Apples', qty: 10, price: 299 }], payment: 'UPI' },
    { user: users[10]._id, order: orders[9]._id, total: 799, items: [{ name: 'Yoga Mat', qty: 1, price: 799 }], payment: 'Cash on Delivery' },
    { user: users[11]._id, order: orders[10]._id, total: 399, items: [{ name: 'Garden Shovel', qty: 1, price: 399 }], payment: 'Credit Card' },
    { user: users[12]._id, order: orders[11]._id, total: 1299, items: [{ name: 'Car Vacuum', qty: 1, price: 1299 }], payment: 'UPI' },
    { user: users[0]._id, order: orders[12]._id, total: 1198, items: [{ name: 'T-shirt', qty: 2, price: 599 }], payment: 'Cash on Delivery' },
    { user: users[1]._id, order: orders[13]._id, total: 899, items: [{ name: 'Basketball', qty: 1, price: 899 }], payment: 'Credit Card' }
  ]);

  console.log('Database seeded!');
  mongoose.disconnect();
};

seed();
