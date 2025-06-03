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
        |                |  AI Tools (APIs):   |                    |
        |                |  - OpenAI (ChatGPT) |                    |
        |                |  - GrokAI           |                    |
        |                |  - Copilot          |                    |
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
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
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

## AI Tools & Tech Used
- **ChatGPT (OpenAI):** Used for conversational AI and natural language processing.
- **OpenAI API:** For advanced AI features and integrations.
- **GrokAI:** For code analysis and suggestions.
- **GitHub Copilot:** For code completion and developer productivity.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Passport.js (Google OAuth), Mongoose
- **Database:** MongoDB Atlas
- **CSV Upload:** Multer, csv-parser
- **Validation:** express-validator

## Known Limitations / Assumptions
- AI features require valid API keys and may incur usage costs.
- Google OAuth requires correct client credentials and callback URLs.
- The backend expects a specific CSV format for customer uploads.
- Segment criteria parsing is basic and may not support complex logical expressions.
- The app assumes a single organization per user (multi-tenancy is not fully supported).
- Error handling and security hardening are basic and should be improved for production.

---

For questions or contributions, please open an issue or pull request.
