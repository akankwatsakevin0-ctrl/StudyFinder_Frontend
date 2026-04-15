# Current Project Status Report
**Project:** StudyGroup Finder
**Date:** 15 April 2026

## 1. Executive Summary
The project is currently in active full-stack development. The frontend is built with React, Tailwind CSS, and React Router v6, while the backend is implemented with Express and Sequelize on MySQL. The application supports protected routes, group browsing, and a JWT-based authentication scaffold on the server.

## 2. Completed Work

### 2.1 Frontend
*   React application is implemented with `react-router-dom` routing in `src/App.jsx`.
*   Protected routes for `/`, `/groups`, `/login`, and `/signup` are configured.
*   Core UI components and pages are present: `Navbar`, `BrowseGroups`, `CreateGroup`, `GroupCard`, `DashboardPage`, `GroupsPage`, `LoginPage`, and `SignUpPage`.
*   `src/services/api.js` configures Axios with a base API URL and JWT request interceptor.
*   `BrowseGroups.jsx` loads groups from the backend via `groupService.getAllGroups()` and includes search/filtering.
*   UI layout and styles are implemented consistently with Tailwind CSS.

### 2.2 Backend
*   Express server is configured in `backend/server.js` with CORS, JSON parsing, error middleware, and automatic Sequelize sync.
*   `backend/config/database.js` connects to MySQL using Sequelize and environment variables.
*   Sequelize models are defined for `User` and `Group` (`backend/models/User.js`, `backend/models/Group.js`), with additional models present for sessions, comments, posts, and group members.
*   Authentication routes are implemented in `backend/routes/authRoutes.js` with JWT generation, registration, login, and protected `/me` endpoint.
*   Group listing is implemented in `backend/routes/groupRoutes.js` via `GET /api/groups`.
*   `backend/package.json` correctly targets MySQL/Sequelize dependencies.

## 3. Current Issues & Technical Debt

*   **Frontend auth flow is incomplete:** `src/components/Login.jsx` uses hardcoded environment credentials and does not call `authService.login()`. `src/components/SignUp.jsx` is currently a static form without backend integration.
*   **Create group flow is not wired:** `CreateGroup.jsx` builds the UI but does not submit data to the backend, and `POST /api/groups` remains a placeholder route.
*   **Backend route coverage is partial:** Group listing is functional, but group creation and some admin/session endpoints still require implementation.
*   **Placeholder UI mapping:** `BrowseGroups.jsx` still uses a placeholder `members: '0/15'` value because backend member counts are not yet exposed.
*   **Environment / deployment docs:** `.env` usage is present in backend and frontend service scaffolding, but the current project lacks a single documented environment variable setup.

## 4. Pending Tasks & Next Steps

1.  Connect `src/components/Login.jsx` and `src/components/SignUp.jsx` to `src/services/api.js` so authentication uses real backend endpoints.
2.  Implement `POST /api/groups` in `backend/routes/groupRoutes.js` and connect `CreateGroup.jsx` to submit new study groups.
3.  Expose real member counts and additional group metadata from the backend response, removing placeholder values in `BrowseGroups.jsx`.
4.  Verify Sequelize model associations, seed data, and `Database.sql` consistency with the active model definitions.
5.  Document required `.env` values for frontend and backend deployment, including `VITE_API_URL`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `JWT_SECRET`, and `JWT_EXPIRE`.
