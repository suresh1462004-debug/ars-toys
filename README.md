# 🧸 A R S TOYS — Full Stack Website

## 📁 Project Structure
```
ars-toys/
├── server.js          ← Main server entry point
├── .env               ← Environment variables (edit this!)
├── package.json       ← Dependencies
├── models/
│   ├── Admin.js       ← Admin login model
│   ├── Product.js     ← Product model
│   └── Order.js       ← Order model
├── routes/
│   ├── auth.js        ← Login/logout API
│   ├── products.js    ← Products CRUD API
│   └── orders.js      ← Orders API
├── middleware/
│   └── auth.js        ← JWT auth middleware
├── uploads/           ← Product photos stored here
└── public/
    ├── index.html     ← Customer shop frontend
    └── admin.html     ← Admin panel frontend
```

## 🚀 Setup & Run

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Edit .env file
Open `.env` and update:
```
MONGODB_URI=mongodb://localhost:27017/ars_toys   ← or your Atlas URL
WA_NUMBER=919876543210                            ← YOUR WhatsApp number
ADMIN_EMAIL=admin@arstoys.com
ADMIN_PASSWORD=Admin@123
```

### Step 3 — Start MongoDB
```bash
mongod
```
Or use MongoDB Atlas (paste connection string in .env)

### Step 4 — Start Server
```bash
npm start
```

### Step 5 — Open Browser
- 🛍️ Shop: http://localhost:5000
- 🛡️ Admin: http://localhost:5000/admin.html

## 🔐 Admin Login
- Email: admin@arstoys.com
- Password: Admin@123

## ✨ Features

### Customer Shop (index.html)
- ✅ Browse all products with photos
- ✅ Filter by category & search
- ✅ Star ratings & discount badges
- ✅ Add to cart & manage quantities
- ✅ Place order with customer details
- ✅ Auto WhatsApp message with full order
- ✅ WhatsApp floating button

### Admin Panel (admin.html)
- ✅ Secure login with JWT
- ✅ Dashboard with stats
- ✅ Add/Edit/Delete products
- ✅ Upload product photos
- ✅ Manage orders & update status
- ✅ WhatsApp customer directly
- ✅ View order details

## 📡 API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/products | Get all products |
| POST | /api/products | Add product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| POST | /api/orders | Place new order |
| GET | /api/orders | Get all orders (admin) |
| PUT | /api/orders/:id/status | Update order status (admin) |

## 🌐 Deploy to Vercel/Railway
1. Push to GitHub
2. Connect to Vercel or Railway
3. Add environment variables
4. Deploy!
