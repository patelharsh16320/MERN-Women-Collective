const Invoice = require("../models/Invoice");

/* CREATE */
const createInvoice = async (req, res) => {
  try {
    const { items, subtotal, shipping, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const invoice = await Invoice.create({
      user: req.user._id,
      items,
      subtotal,
      shipping: shipping || 0,
      total,
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL */
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ONE */
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById
};