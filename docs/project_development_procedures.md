# Project Development Procedures

This document explains the purpose of each major procedure undertaken while building the StudyGroup Finder application.

## How to use this document

- Read the procedure headings to understand the main development phases.
- Use the purpose line to quickly see why each step exists.
- Refer to the bullet list for the specific work completed in code and architecture.
- Share this file with stakeholders to explain the app build process or onboard new contributors.

## 1. Requirements & Planning
Purpose: define the product scope, user needs, and success criteria.
- Created a Product Requirement Document (PRD) describing the platform goal, user personas, functional requirements, and non-functional expectations.
- Identified core capabilities: user authentication, group discovery, group creation, session tracking, and a dashboard.
- Established the technology stack: React + Tailwind CSS for the frontend, Express + Sequelize + MySQL for the backend.

## 2. Application Architecture
Purpose: structure the project into clean frontend, backend, and database layers.
- Separated the codebase into `src/` for the React frontend and `backend/` for the API server.
- Chose a decoupled architecture so the frontend can call the backend over REST and remain reusable.
- Used `Database/Database.sql` and Sequelize models to document and implement the schema.

## 3. Frontend Setup
Purpose: bootstrap a responsive, single-page user interface.
- Initialized the React application with `create-react-app` conventions and Tailwind CSS styling.
- Added `react-router-dom` to support route-based navigation.
- Built page-level components: `DashboardPage`, `GroupsPage`, `LoginPage`, `SignUpPage`.
- Built reusable UI components: `Navbar`, `BrowseGroups`, `CreateGroup`, `GroupCard`.

## 4. Client Routing
Purpose: navigate users through the app without full page reloads.
- Implemented `src/App.jsx` with `BrowserRouter`, `Routes`, and `Route`.
- Configured protected routes for authenticated access to `/` and `/groups`.
- Redirected unauthenticated users to `/login` and simplified fallback handling.

## 5. API Service Layer
Purpose: centralize backend communication and attach authentication headers.
- Created `src/services/api.js` with Axios configured for `http://localhost:5000/api`.
- Added an interceptor to include `Authorization: Bearer <token>` automatically when a token exists.
- Implemented service functions for login, registration, group listing, and group creation.

## 6. Backend Setup
Purpose: create a scalable API server for app data and authentication.
- Built `backend/server.js` to start an Express server with CORS and JSON parsing.
- Configured environment variables via `dotenv` for host, port, database, and JWT settings.
- Added centralized error handling middleware to return consistent server errors.

## 7. Database Connection
Purpose: connect the backend to persistent storage.
- Implemented `backend/config/database.js` to initialize Sequelize using MySQL credentials.
- Used `sequelize.authenticate()` and `sequelize.sync()` in `backend/server.js` to verify connection and synchronize models.

## 8. Data Modeling
Purpose: define the shape of the application data and relationships.
- Created Sequelize models for `User` and `Group` in `backend/models/`.
- Each model includes validation rules, typed fields, and database table mapping.
- Ensured `User` includes authentication fields and optional student profile data.
- Ensured `Group` includes metadata for course, meeting information, and group leadership.

## 9. Authentication Procedure
Purpose: securely register users, authenticate them, and protect private resources.
- Implemented registration and login endpoints in `backend/routes/authRoutes.js`.
- Used `express-validator` to validate incoming request data.
- Checked existing users and created new users via Sequelize.
- Generated JWT tokens with `jsonwebtoken` for authenticated sessions.
- Provided a protected `/api/auth/me` route using middleware.

## 10. Route Implementation
Purpose: expose backend functionality through HTTP endpoints.
- Registered backend routers in `backend/server.js` for `/api/auth`, `/api/groups`, `/api/sessions`, and `/api/admin`.
- Implemented `GET /api/groups` in `backend/routes/groupRoutes.js` to return the current group list.
- Left `POST /api/groups` as a placeholder for future group creation logic.

## 11. Frontend Data Flow
Purpose: connect UI components to real backend data.
- Implemented `BrowseGroups.jsx` to call `groupService.getAllGroups()` and load available groups.
- Added search filtering inside the component for `courseCode` and `groupName`.
- Mapped backend group fields into UI-friendly display props for `GroupCard`.
- Included loading and error states to improve UX.

## 12. UI / UX Design Procedure
Purpose: create a visually coherent and usable interface.
- Applied Tailwind utility classes to ensure consistent spacing, colors, and typography.
- Designed cards and forms with clear labels, buttons, and feedback states.
- Added responsive layout behavior for the group browsing grid.
- Included descriptive messaging for loading, errors, and empty results.

## 13. Security and Technical Debt Review
Purpose: document known risks and incomplete features.
- Noted that `Login.jsx` still uses hardcoded environment-based credential checking instead of a real login request.
- Noted that `SignUp.jsx` is a static UI form and is not yet wired to `authService.register()`.
- Documented that `CreateGroup.jsx` is currently UI-only and does not yet submit data to the backend.

## 14. Next Procedure Steps
Purpose: plan the next implementation activities.
- Complete authentication wiring by connecting login and signup forms to the backend API.
- Implement group creation and persist new groups through `POST /api/groups`.
- Add model associations and join logic for group membership counts.
- Document environment variable setup and deployment instructions.
