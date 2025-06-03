# XENO Project

## Architecture Diagram

```
+-------------------+         +-------------------+         +-------------------+
|   Frontend (Vite  |  <--->  |   Backend (NodeJS |  <--->  |   MongoDB Atlas   |
|   + React + Tail- |  REST   |   + Express +     |  ODM    |                   |
|   wind CSS)       |  APIs   |   Passport +      |         |                   |
|                   |         |   Mongoose)       |         |                   |
+-------------------+         +-------------------+         +-------------------+
        |                            |                               |
        |                            |                               |
        |                            v                               |
        |                +---------------------+                    |
        |                |  (No AI tools in    |                    |
        |                |  deployed stack)    |                    |
        |                +---------------------+                    |
```

## Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   SESSION_SECRET=your_session_secret
   MONGODB_URL=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://mini-messager04.onrender.com/auth/google/callback
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Usage
- Visit `/login` to sign in with Google.
- After login, access the dashboard, upload customer CSVs, create segments, and manage campaigns.

## AI Usage Disclaimer
This project does **not** include any custom AI features or integrations. AI tools (such as ChatGPT, GitHub Copilot, etc.) were only used to assist with code generation, refactoring, and documentation during development.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Passport.js (Google OAuth), Mongoose
- **Database:** MongoDB Atlas
- **CSV Upload:** Multer, csv-parser
- **Validation:** express-validator

## Known Limitations / Assumptions
- Google OAuth requires correct client credentials and callback URLs.
- The backend expects a specific CSV format for customer uploads.
- Segment criteria parsing is basic and may not support complex logical expressions.
- The app assumes a single organization per user (multi-tenancy is not fully supported).
- Error handling and security hardening are basic and should be improved for production.

---

**Note:** No custom AI tools (such as OpenAI, ChatGPT, GrokAI, Copilot, etc.) are part of the deployed application. AI was only used for development assistance and code generation, not as a feature or dependency in the running product.

For questions or contributions, please open an issue or pull request.
