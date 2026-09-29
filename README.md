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

The backend connects to the `fullstack` database at `mongodb://localhost:27017/fullstack`.

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
- Dashboard data
- Stock lists and individual stock details
- Portfolio data
- Transactions
- Analytics
