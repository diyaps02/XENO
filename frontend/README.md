# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# XENO Frontend

## Overview
This frontend is built with React, Vite, and Tailwind CSS. It provides a modern UI for authentication, dashboard, customer upload, segment and campaign management, and integrates with the backend via REST APIs.

---

## Main Routes (React Router)

### `/login`
- **Description:** Google OAuth login page.
- **UI:** Google sign-in button.
- **Behavior:** Redirects to backend `/auth/google` for authentication.

### `/profile`
- **Description:** User profile page.
- **UI:** Shows user info, allows completing profile (companyName, role).
- **Behavior:** If profile incomplete, shows a form to complete it.

### `/dashboard`
- **Description:** Main dashboard after login.
- **UI:**
  - Welcome message
  - Stats cards (segments, campaigns, success rate)
  - Quick actions (create segment/campaign)
  - Recent campaigns
  - **CSV Upload Form** (enter email, upload CSV)

### `/upload-csv`
- **Description:** Standalone CSV upload form (email + file).
- **UI:** Form to upload customer CSV for a user.

### `/segments`
- **Description:** List all segments.
- **UI:** Table/list of segments.

### `/segments/create`
- **Description:** Create a new segment.
- **UI:** Form for segment details and rule builder. Preview audience size.

### `/campaigns`
- **Description:** List all campaigns.
- **UI:** Table/list of campaigns.

### `/campaigns/create`
- **Description:** Create a new campaign.
- **UI:** Form for campaign details.

### `/campaigns/:id`
- **Description:** Campaign details page.
- **UI:** Shows campaign info and status.

---

## API Integration
- All data is fetched from the backend via REST APIs (see backend README for endpoints).
- Authenticated requests use `credentials: "include"` for session/cookie.
- CSV upload uses a `multipart/form-data` POST request.

---

## Components
- **AuthWrapper:** Protects routes, redirects to login/profile if not authenticated or profile incomplete.
- **Navbar:** Navigation bar for main pages.
- **RuleBuilder:** UI for building segment criteria.
- **CsvUploadForm:** Form for uploading customer CSVs.

---

## Error Handling
- All API errors are shown as messages in the UI.
- Form validation is performed client-side and server-side.

---

## Notes
- The frontend expects the backend to be running at `http://localhost:3000`.
- For Google OAuth, the backend handles authentication and redirects back to the frontend.
- Tailwind CSS is used for styling.

---

For more details, see the code in the `src/pages/` and `src/Components/` folders.
