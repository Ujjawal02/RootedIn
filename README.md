# RootedIn

A tree sponsorship platform. Users sponsor trees, admins review requests and assign farmers, and farmers post dated photo updates that sponsors can follow.

**Live demo:** [deployed link]

## Features

**Users**
- Browse trees, add them to a cart, or sponsor one directly
- Track every sponsorship and its status in My Tree
- Follow a dated photo timeline posted by the assigned farmer

**Admins**
- Create, edit and soft-delete trees, and restore deleted ones
- Approve or reject sponsorship requests
- Assign approved requests to farmers

**Farmers**
- See the trees assigned to them
- Post photo updates with notes
- Mark a tree as completed

## Tech stack
- **Client:** React, Vite, Redux Toolkit, RTK Query, React Router, Bootstrap
- **Server:** Node.js, Express, MongoDB with Mongoose
- **Auth and validation:** JWT in httpOnly cookies, bcrypt, Joi, role-based middleware
- **Images:** Cloudinary, uploaded through multer
- **Tests:** Jest, Supertest, mongodb-memory-server

## How it works
A sponsorship moves through `pending → approved → assigned → completed` (or `rejected`). Each change is one database query that also checks the current status, so a request can never skip a step. Farmer actions also check that the sponsorship belongs to the logged-in farmer.

## Getting started

Requirements: Node.js 20 or newer, a MongoDB database (local or Atlas), a Cloudinary account.

```bash
git clone https://github.com/Ujjawal02/RootedIn.git
cd RootedIn
```

**Server**
```bash
cd server
npm install
cp .env.example .env     # then fill in the values below
npm run dev
```

| Variable | Purpose |
|---|---|
| `PORT` | Port for the API (default 3000) |
| `DBURL` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLIENT_URL` | Address of the client, for CORS (e.g. http://localhost:5173) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials |

**Client**
```bash
cd client
npm install
npm run dev
```
Create `client/.env` with `VITE_API_URL=http://localhost:3000`.

**Create an admin and a farmer**
Signup always creates a normal user. Use the script to create the other roles:
```bash
cd server
ACCOUNT_EMAIL=you@example.com ACCOUNT_PASSWORD=your-password ACCOUNT_ROLE=admin npm run create-account
```
On Windows PowerShell, set the three variables with `$env:NAME="value"` first.

**Run the tests**
```bash
cd server
npm test
```
The tests use an in-memory MongoDB and a mocked image service, so they need no database or Cloudinary account. The first run downloads a MongoDB binary, which takes a minute.

## Project structure
```
client/src
  app/          Redux store
  features/     RTK Query API files and the auth slice
  pages/        auth, user, admin, farmer and public pages
  components/   shared UI such as Navbar, ProtectedRoute, ImagePicker
  routes/       route table and role checks
server/src
  routes/       URL to controller mapping
  middlewares/  auth, role checks, validation, uploads, errors
  controllers/  application logic
  models/       User, Tree, Cart, Sponsorship, GrowthUpdate
  services/     Cloudinary upload service
server/tests    integration tests
```

## Screenshots

## Roadmap
Farmer verification, Google login, occasion sponsorships, notifications, online payments.