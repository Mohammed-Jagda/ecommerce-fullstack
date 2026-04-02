# ShopEase - Full Stack E-Commerce

A complete e-commerce platform built with modern web technologies.

## Tech Stack

- **Frontend**: Next.js 14, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Payment**: Stripe (Mock)

## Features

### Consumer Panel
- Browse and search products by category
- Add to cart with stock validation
- Checkout with shipping address
- Track order status in real time

### Admin Panel
- Add, edit, delete products with image upload
- View all orders
- Update order status (Pending → Ready to Ship → Dispatched)
- Dashboard with revenue and stats

## Project Structure
```
ecommerce/
├── server/              # Express API
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── middleware/      # Auth & upload
└── client/              # Next.js Frontend
    ├── app/             # Pages
    ├── components/      # Reusable components
    ├── store/           # Redux state
    └── lib/             # Axios instance
```

## Setup Instructions

### Backend
```bash
cd server
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:3000
```

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Demo Credentials

- **Admin**: admin@test.com / admin123
- **Consumer**: Register a new account at /register

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register consumer |
| POST | /api/auth/login | Public | Login |
| GET | /api/products | Public | Get all products |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET | /api/orders | Admin | Get all orders |
| PUT | /api/orders/:id/status | Admin | Update order status |
| POST | /api/cart | Consumer | Add to cart |
| GET | /api/cart | Consumer | Get cart |
| POST | /api/orders | Consumer | Place order |
| GET | /api/orders/mine | Consumer | Get my orders |