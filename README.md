# ⚡ ShopNow — 3-Tier E-Commerce App

A full-stack e-commerce application with React frontend, Node/Express backend, and PostgreSQL database.

## 📁 Project Structure

```
ecommerce/
├── frontend/          # React (Tier 1 — Presentation)
│   ├── public/
│   └── src/
│       ├── components/   # Navbar, ProductCard
│       ├── context/      # AuthContext, CartContext
│       ├── pages/        # Home, Cart, Orders, Login, Register
│       ├── api.js        # Axios instance
│       └── App.js        # Router
│
├── backend/           # Node/Express (Tier 2 — Application)
│   ├── db/            # PostgreSQL connection + schema init
│   ├── middleware/    # JWT auth middleware
│   ├── routes/        # auth, products, cart, orders
│   └── server.js      # Express app entry point
│
└── README.md
```

## 🚀 Quick Start (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Set up PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE ecommerce;"
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # edit DB credentials if needed
npm install
npm start
# Server: http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/products | — | List products (search, filter) |
| GET | /api/products/:id | — | Single product |
| GET | /api/products/meta/categories | — | All categories |
| GET | /api/cart | ✅ | Get user's cart |
| POST | /api/cart | ✅ | Add item to cart |
| PUT | /api/cart/:id | ✅ | Update quantity |
| DELETE | /api/cart/:id | ✅ | Remove item |
| DELETE | /api/cart | ✅ | Clear cart |
| GET | /api/orders | ✅ | Get user's orders |
| POST | /api/orders/checkout | ✅ | Place order from cart |
| GET | /api/health | — | Health check |

## 🐳 Docker (Next Step)

See `docker-compose.yml` once you create it. You'll need:
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml` at root

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=ecommerce_secret_key_2024
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

## ✅ Features
- User registration & login (JWT)
- Product listing with search & category filter
- Add to cart, update quantity, remove items
- Checkout with stock validation (atomic transaction)
- Order history
- Auto-seeded product catalog (8 products)
