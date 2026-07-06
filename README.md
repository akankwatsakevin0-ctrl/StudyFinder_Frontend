<div align="center">

# StudyGroup Finder

[![React](https://img.shields.io/badge/React%2018-61DAFB?logo=react&logoColor=000)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL%208.0-4479A1?logo=mysql&logoColor=fff)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=fff)](https://sequelize.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A platform for students to **discover, join, and manage academic study groups** efficiently.

</div>

---

## Features

- **User Authentication** — Register and login with JWT-based auth
- **Study Groups** — Browse, create, and join study groups
- **Study Sessions** — Schedule and manage study sessions within groups
- **Admin Dashboard** — Platform oversight and user/group management
- **Responsive Design** — Works across desktop and mobile devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Tailwind CSS, Axios |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MySQL 8.0 with Sequelize ORM |
| Validation | express-validator |
| Notifications | react-hot-toast |

## Prerequisites

- Node.js 18+
- MySQL 8.0

## Getting Started

```bash
# Clone
git clone https://github.com/akankwatsakevin0-ctrl/StudyFinder_Frontend.git
cd StudyFinder_Frontend

# Set up database
# Import the SQL schema from Database/Database.sql into your MySQL server

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm start        # or: npm run dev (with nodemon)

# Frontend setup (new terminal)
cd ../src
npm install
npm start        # or: npm run dev
```

The app runs at **http://localhost:3000** (frontend) with the backend on **http://localhost:5000**.

## API Endpoints

| Prefix | Auth | Purpose |
|--------|------|---------|
| `/api/auth` | No | Register / Login |
| `/api/groups` | Yes | Study group CRUD & membership |
| `/api/sessions` | Yes | Study session management |
| `/api/admin` | Admin | User & group administration |

## Project Structure

```
StudyFinder_Frontend/
├── backend/
│   ├── config/        — Database configuration
│   ├── controllers/   — Route handlers
│   ├── middleware/     — Auth & validation middleware
│   ├── models/        — Sequelize models
│   ├── routes/        — Express routers
│   ├── seed.js        — Database seeder
│   └── server.js      — Express app entry point
├── src/
│   ├── components/    — Reusable React components
│   ├── pages/         — Route-level page components
│   ├── services/      — Axios API service layer
│   ├── App.jsx        — Main app component
│   └── index.jsx      — Entry point
├── Database/
│   └── Database.sql   — MySQL schema
├── docs/              — Documentation
└── public/            — Static assets
```

---

<div align="center">Built with React, Express, and MySQL</div>
