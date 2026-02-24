const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  category:      { type: String, required: true, enum: ['educational','outdoor','creative','vehicles','stuffed','electronic'] },
  emoji:         { type: String, default: '🧸' },
  img:           { type: String, default: '' },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  age:           { type: String, required: true },
  desc:          { type: String, required: true },
  badge:         { type: String, enum: ['new','hot','sale','top',''], default: 'new' },
  bg:            { type: String, default: '#E3F2FD' },
  inStock:       { type: Boolean, default: true },
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviews:       { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
