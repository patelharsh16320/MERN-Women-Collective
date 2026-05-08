const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  date: { type: Date, default: Date.now },
  total: Number,
  items: [
    {
      name: String,
      qty: Number,
      price: Number
    }
  ],
  payment: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
