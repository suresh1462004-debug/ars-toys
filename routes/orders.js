const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const { protect } = require('../middleware/auth');

// POST /api/orders — public, customer places order
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, items, total, paymentMode, notes } = req.body;
    if (!customerName || !phone || !items || !items.length || !total) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const order = await Order.create({ customerName, phone, address, items, total, paymentMode, notes });
    res.status(201).json({ success: true, order });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// GET /api/orders — admin only, all orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { orderNo: { $regex: search, $options: 'i' } }
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/orders/stats — admin only, dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total    = await Order.countDocuments();
    const pending  = await Order.countDocuments({ status: 'pending' });
    const revenue  = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.json({ success: true, total, pending, revenue: revenue[0]?.total || 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/orders/:id — admin only
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PUT /api/orders/:id/status — admin only, update status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// DELETE /api/orders/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
