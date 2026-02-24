const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNo:     { type: String, unique: true },
  customerName:{ type: String, required: true },
  phone:       { type: String, required: true },
  address:     { type: String, default: '' },
  items: [{
    product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      String,
    price:     Number,
    qty:       Number,
    img:       String,
    emoji:     String
  }],
  total:       { type: Number, required: true },
  status:      { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  paymentMode: { type: String, enum: ['cod','upi','online'], default: 'cod' },
  notes:       { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

OrderSchema.pre('save', async function(next) {
  if (!this.orderNo) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNo = 'ARS' + String(count + 1001).padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
