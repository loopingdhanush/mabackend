# AI Apparel Frontend

A modern React + Vite frontend application for an AI-powered apparel platform. This repository contains the user interface built with cutting-edge technologies including React , Vite, Firebase, and Axios.

## About

AI Apparel Frontend is a feature-rich React application designed to provide users with an interactive platform for AI-powered apparel selection and customization. The application leverages Firebase for authentication and real-time features, and communicates with backend services via REST APIs.

### Key Features

- ⚡ Fast development and build with Vite
- 🔐 Authentication and database via Firebase
- 🌐 Seamless API integration with Axios
- 🛣️ Client-side routing with React Router v7

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.3.1 |
| **Routing** | React Router DOM | 7.13.0 |
| **Backend Communication** | Axios | 1.13.5 |
| **Authentication/Database** | Firebase | 12.9.0 |
| **Linting** | ESLint | 9.39.1 |
| **Node** | v16+ (recommended) | - |
| **Package Manager** | npm or yarn | 8.0+ |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) – [Download here](https://nodejs.org/)
- **npm** (v8.0+) or **yarn** (v3.0+)
- **Git** – [Download here](https://git-scm.com/)
- A **Firebase Project** with credentials (API keys, etc.)

To check if Node.js and npm are installed:

```bash
node --version
npm --version
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/loopingdhanush/mafrontend.git
cd mafrontend
```

### Step 2: Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **yarn**:

```bash
yarn install
```

This will install all required packages listed in `package.json`.

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_API_BASE_URL=http://localhost:3001
```

**Where to find these values:**
1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** → **General**
4. Scroll down to find your config object
5. Copy the required values to `.env.local`

---

## Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (choose your preferred sign-in methods: Email/Password, Google, etc.)
3. Create a **Realtime Database** or **Firestore** as per your needs
4. Get your config credentials and add them to `.env.local`

### Backend API Configuration

Update `VITE_API_BASE_URL` in `.env.local` to point to your backend server:

```env
# Development
VITE_API_BASE_URL=http://localhost:3001

# Production
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Running the Application

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will typically open at:
```
http://localhost:5173
```

You can modify the port in `vite.config.js` if needed.

### Access the Application

Open your browser and navigate to `http://localhost:5173` to view the application.

---

### Directory Explanations

- **`public/`** – Static files served as-is; good for favicons, robots.txt, etc.
- **`src/`** – All source code
  - **`components/`** – Reusable UI components
  - **`pages/`** – Full-page components (routes)
  - **`services/`** – API and Firebase logic
  - **`utils/`** – Helper functions
- **`.env.local`** – Environment variables (create this file, don't commit it)

---

## Code Quality

### ESLint

This project uses ESLint to maintain code quality and consistency.

#### Run Linter

```bash
npm run lint
```

#### Auto-fix Issues

```bash
npm run lint -- --fix
```

#### ESLint Configuration

ESLint rules are configured in `eslint.config.js`. Customize as needed for your team's standards.

---

## Troubleshooting

### Issue: Port 5173 already in use

**Solution:** Change the port in `vite.config.js`:

```javascript
export default {
  server: {
    port: 3000,
  },
};
```

Or kill the existing process:

```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Firebase authentication not working

**Solution:**
- Verify `.env.local` has correct Firebase credentials
- Check that authentication methods are enabled in Firebase Console
- Ensure CORS is properly configured in your backend

### Issue: Build fails with "module not found"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Hot reload not working

**Solution:**
- Restart the dev server: `npm run dev`
- Check that `vite.config.js` is correct
- Try clearing browser cache (Ctrl+Shift+Del)

### Issue: ESLint errors preventing build

**Solution:**
```bash
npm run lint -- --fix
```

If issues persist, review the specific error in your IDE or console.

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `my-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `my-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc...` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3001` |

---

## Security Considerations

1. ✅ **Never commit `.env.local`** – It's in `.gitignore`
2. ✅ **Use HTTPS in production**
3. ✅ **Validate user input** on the frontend and backend
4. ✅ **Use Firebase Security Rules** for database access control
5. ✅ **Keep dependencies updated** – Run `npm audit`
6. ✅ **Use environment variables** for sensitive data

---

## Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Set all environment variables in production
- [ ] Run `npm run build` and verify output
- [ ] Run `npm run lint` and fix any issues
- [ ] Test production build locally with `npm run preview`
- [ ] Set up HTTPS certificate
- [ ] Configure CORS properly
- [ ] Set up CI/CD pipeline
- [ ] Monitor application performance
- [ ] Set up error logging/monitoring
