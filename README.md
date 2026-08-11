# Store Rating Platform

A full-stack web app where users can submit ratings (1-5) for stores. Three
roles share a single login: **System Administrator**, **Normal User**, and
**Store Owner**.

## Tech stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Express.js, layered as `routes → controllers → services → repositories`
- **Database:** MySQL, accessed with raw SQL via `mysql2` (no ORM)
- **Auth:** JWT, password hashing with bcrypt

## Project structure

```
store-rating-app/
├── backend/
│   ├── database/
│   │   ├── schema.sql        # run this first to create tables
│   │   └── seed.js           # creates the first admin account
│   └── src/
│       ├── config/           # DB pool + env config
│       ├── controllers/      # thin, HTTP-facing
│       ├── services/         # business logic
│       ├── repositories/     # raw SQL queries
│       ├── routes/
│       ├── middlewares/      # auth, role guard, error handler
│       ├── validators/       # request validation
│       └── utils/
└── frontend/
    └── src/
        ├── api/               # axios calls per resource
        ├── components/common/ # Navbar, Table, StarRating, Input, Button, Modal
        ├── context/           # AuthContext (login state)
        ├── pages/             # admin/, user/, owner/
        └── routes/            # ProtectedRoute
```

## 1. Database setup

You need a running MySQL server (local install, Docker, or a managed instance).

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `store_rating_db` database and its three tables
(`users`, `stores`, `ratings`).

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set DB_USER, DB_PASSWORD, and a real JWT_SECRET

npm install
npm run seed     # creates the first admin login
npm run dev       # starts the API on http://localhost:5000
```

The seed script prints the admin's email/password — log in with those and
change the password afterwards.

**Health check:** `GET http://localhost:5000/health` should return `{ "success": true }`.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # points VITE_API_BASE_URL at the backend
npm install
npm run dev             # starts the app on http://localhost:5173
```

## How the roles work

| Role | Can do |
|---|---|
| **System Administrator** | Add stores, add users (any role), view dashboard stats, view/filter/sort user & store lists, view a user's full detail (with rating if they're a Store Owner) |
| **Normal User** | Sign up, log in, browse/search stores, submit or update a 1-5 rating per store, change password |
| **Store Owner** | Log in, view a dashboard of everyone who rated their store plus the average rating, change password |

Sign-up (`/signup`) always creates a **Normal User**. Admin and Store Owner
accounts are created by an administrator from `/admin/users`. To create a
Store Owner whose dashboard is populated, first create the user with role
`OWNER`, then create a store from `/admin/stores` and enter that user's ID
as the owner.

## Validation rules (enforced on both frontend and backend)

- **Name:** 20-60 characters
- **Address:** up to 400 characters
- **Password:** 8-16 characters, at least one uppercase letter and one special character
- **Email:** standard email format
- **Rating:** whole number, 1-5

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| PATCH | `/api/auth/password` | Any logged-in user |
| GET | `/api/admin/dashboard` | Admin |
| GET/POST | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| GET/POST | `/api/admin/stores` | Admin |
| GET | `/api/stores` | Normal user |
| POST | `/api/ratings/stores/:storeId` | Normal user |
| GET | `/api/ratings/owner/dashboard` | Store owner |

All listing endpoints (`/admin/users`, `/admin/stores`, `/stores`) accept
`sortBy` and `sortOrder` query params, plus `name`/`email`/`address`/`role`
filters where applicable.
