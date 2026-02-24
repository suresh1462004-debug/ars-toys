require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));

// Config endpoint
app.get('/api/config', (req, res) => {
  res.json({ waNumber: process.env.WA_NUMBER || '919876543210' });
});

// Seed admin if none exists
const Admin   = require('./models/Admin');
const Product = require('./models/Product');

async function seedData() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({
      name: 'ARS Admin',
      email: process.env.ADMIN_EMAIL || 'admin@arstoys.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123'
    });
    console.log('✅ Admin created:', process.env.ADMIN_EMAIL);
  }

  const pCount = await Product.countDocuments();
  if (pCount === 0) {
    const samples = [
      { name:"Rainbow Abacus",       category:"educational", emoji:"🔢", price:449, originalPrice:599,  age:"3-8 yrs",  desc:"Colorful counting beads to teach numbers and maths",      badge:"new",  bg:"#E3F2FD", rating:4.5, reviews:24 },
      { name:"Dinosaur Set",         category:"educational", emoji:"🦕", price:699, originalPrice:899,  age:"4-10 yrs", desc:"12 realistic dinosaur figures with play mat included",    badge:"hot",  bg:"#F3E5F5", rating:4.8, reviews:56 },
      { name:"Puzzle World Map",     category:"educational", emoji:"🌍", price:549, originalPrice:null, age:"5-12 yrs", desc:"60-piece colorful world map jigsaw puzzle",               badge:"top",  bg:"#E8F5E9", rating:4.3, reviews:18 },
      { name:"Magic Drawing Board",  category:"creative",    emoji:"🎨", price:299, originalPrice:399,  age:"2-7 yrs",  desc:"Erasable LCD writing tablet with stylus pen",             badge:"sale", bg:"#FFF3E0", rating:4.6, reviews:42 },
      { name:"Racing Car Set",       category:"vehicles",    emoji:"🏎️", price:899, originalPrice:1199, age:"5-12 yrs", desc:"4 friction-powered cars with loop track & launcher",     badge:"hot",  bg:"#FCE4EC", rating:4.7, reviews:89 },
      { name:"Giant Teddy Bear",     category:"stuffed",     emoji:"🧸", price:1299,originalPrice:1599, age:"1+ yrs",   desc:"Super soft 60cm teddy bear, perfect gift for all ages",  badge:"top",  bg:"#FFF8E1", rating:4.9, reviews:134 },
      { name:"RC Helicopter",        category:"electronic",  emoji:"🚁", price:1499,originalPrice:1999, age:"8+ yrs",   desc:"3.5 channel indoor remote control helicopter",           badge:"new",  bg:"#E0F7FA", rating:4.4, reviews:31 },
      { name:"Cricket Set Junior",   category:"outdoor",     emoji:"🏏", price:699, originalPrice:899,  age:"5-14 yrs", desc:"Plastic bat, ball, stumps - full junior cricket kit",   badge:"hot",  bg:"#E8F5E9", rating:4.5, reviews:67 },
      { name:"Building Blocks 100pc",category:"educational", emoji:"🟦", price:599, originalPrice:749,  age:"3-10 yrs", desc:"100 colorful interlocking blocks for creative building",  badge:"top",  bg:"#F3E5F5", rating:4.6, reviews:45 },
      { name:"Remote Control Car",   category:"vehicles",    emoji:"🚗", price:1199,originalPrice:1499, age:"6+ yrs",   desc:"High-speed 1:18 scale RC car with rechargeable battery", badge:"hot",  bg:"#E3F2FD", rating:4.7, reviews:92 },
    ];
    await Product.insertMany(samples);
    console.log('✅ Sample products seeded!');
  }
}

// DB connection with caching for serverless
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('✅ MongoDB Connected');
  await seedData();
}

// Connect DB then start server
connectDB()
  .then(() => {
    // Only listen if NOT running on Vercel (serverless)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 ARS Toys running on http://localhost:${process.env.PORT || 5000}`);
        console.log(`🛡️  Admin Panel: http://localhost:${process.env.PORT || 5000}/admin.html`);
      });
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// Export for Vercel serverless
module.exports = app;
