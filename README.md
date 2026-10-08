# Stock Portfolio Dashboard

A full-stack stock and portfolio management dashboard. The React frontend provides views for the dashboard, stocks, stock details, portfolio, transactions, and analytics, while the Express backend exposes the API and stores data in MongoDB.

## Tech Stack

- React 19 with Vite
- React Router and Recharts
- Node.js with Express 5
- MongoDB with Mongoose

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally on its default port (`27017`)

The backend reads `MONGO_URL` and `PORT` from `backend/.env`. The default local
configuration uses `mongodb://localhost:27017/fullstack` and port `4000`.

To enable the admin panel, add `ADMIN_EMAIL=admin@example.com` to the backend `.env`,
replacing it with the email address of an already registered account, then restart the
backend. Only that account can access admin endpoints. Admins can review users and
transactions, activate or deactivate users, and add or edit stock catalog entries.
The configured administrator account cannot be deactivated from the panel.

## Getting Started

Clone the repository and install dependencies for both applications:

```bash
cd react-project-repo/backend
npm install

cd ../frontend
npm install
```

Start the backend in one terminal:

```bash
cd react-project-repo/backend
npm start
```

Start the frontend in a second terminal:

```bash
cd react-project-repo/frontend
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. The frontend proxies `/api` requests to the backend at `http://localhost:4000`.

## Available Scripts

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

### Backend

- `npm start` - start the Express server with Nodemon

## API Routes

The backend is mounted at `/api` and currently includes routes for:

- User registration and login
- Authenticated current-user profile (`GET /api/me`)
- Development-only password reset (`POST /api/forgotPassword`, `POST /api/resetPassword`)
- Appearance and account settings (`/settings`)
- Dashboard data
- Stock catalog and detail endpoints (`GET /api/stocks`, `GET /api/stocks/:symbol`)
- Browser stock page (`GET /stocks`)
- Portfolio data
- Transactions
- Analytics
- Admin management (`GET /api/admin/overview`, `PATCH /api/admin/users/:userId/status`,
  `POST /api/admin/stocks`, `PATCH /api/admin/stocks/:symbol`; requires the account
  configured by `ADMIN_EMAIL`)

In development, the forgot-password response includes a reset link in the app. Reset links
expire after 15 minutes and work once. Password-reset delivery is disabled in production until
an email delivery provider is configured.
