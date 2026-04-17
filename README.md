
# 🎨 AI Fashion Backend

An Express.js backend service for generating AI-powered fashion designs using Firebase authentication, Cloudinary image hosting, and AI image generation API.

---

## ✨ Features

- 🔐 **Firebase Authentication** - Secure user authentication with JWT tokens
- ☁️ **Cloudinary Integration** - Store and manage generated images in the cloud
- 🔄 **Queue Management** - Check AI server queue status
- 📦 **RESTful APIs** - Clean, RESTful API endpoints
- 🛡️ **Token Verification** - Middleware-based user verification

---

## 📁 Project Structure

```
mabackend/
├── server.js                              # Main application file
├── package.json                           # Project dependencies
├── package-lock.json                      # Dependency lock file
├── .env                                   # Environment variables (add to .gitignore)
├── .gitignore                             # Git ignore file
├── ai-fashion-57f19-firebase-adminsdk-fbsvc-5a6515820e.json  # Firebase credentials
└── README.md                              # This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework for Node.js |
| **Firebase Admin SDK** | Authentication & Firestore database |
| **Cloudinary** | Image storage and CDN |
| **Axios** | HTTP client for API calls |
| **Multer** | File upload middleware |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/loopingdhanush/mabackend.git
cd mabackend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `express` - Web framework
- `firebase-admin` - Firebase SDK
- `cloudinary` - Image hosting
- `axios` - HTTP requests
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `multer` - File uploads

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env  # if available, or create new
```

Add the following environment variables to `.env`:

```env
# Server Port
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# AI Server Configuration
AI_SERVER=http://your-ai-server-url:port
```

### Step 4: Add Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `ai-fashion-57f19-firebase-adminsdk-fbsvc-5a6515820e.json` in the root directory
6. **⚠️ Keep this file secret - add it to `.gitignore`**

### Step 5: Start the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on the port specified in your `.env` file (default: `http://localhost:3000`).

---

## 📡 API Endpoints

### 1. Get AI Queue Status

**Endpoint:** `GET /queue`

**Description:** Check the current status of the AI image generation queue

**Response:**
```json
{
  "queue_length": 5,
  "estimated_wait": "2 minutes"
}
```

---

### 2. Generate Images from Prompts

**Endpoint:** `POST /generate`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {firebase-id-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompts": [
    "A modern red summer dress",
    "Elegant black leather jacket"
  ]
}
```

**Response:**
```json
{
  "tasks": [
    { "taskId": "task_123abc" },
    { "taskId": "task_456def" }
  ]
}
```

---

### 3. Check Generation Result

**Endpoint:** `GET /result/:taskId`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Parameters:**
- `taskId` (string) - The task ID from the generate endpoint

**Responses:**

**If image is ready (200):**
```json
{
  "status": "done",
  "imageUrl": "https://res.cloudinary.com/...",
  "prompt": "A modern red summer dress"
}
```

**If still processing (200):**
```json
{
  "status": "processing"
}
```

---

### 4. Get User's Generated Designs

**Endpoint:** `GET /my-designs`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Response:**
```json
[
  {
    "id": "design_001",
    "uid": "user_123",
    "prompt": "A modern red summer dress",
    "imageUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## 🔐 Authentication

All endpoints except `/queue` require Firebase authentication.

### How to get a token:

1. **Firebase Web SDK** (Frontend):
```javascript
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();
```

2. **Send with API requests**:
```javascript
const response = await fetch('http://localhost:3000/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompts: ['A red dress'] })
});
```

---

## 🗄️ Database Structure (Firestore)

### `designs` Collection

```
designs/
├── document_id
│   ├── uid: string         (User ID from Firebase)
│   ├── prompt: string      (Original prompt text)
│   ├── imageUrl: string    (Cloudinary URL)
│   └── createdAt: timestamp
```

---

## 🐛 Troubleshooting

### Issue: "No token" Error
- **Cause:** Missing or invalid Bearer token
- **Solution:** Ensure you're sending the token in the `Authorization` header

### Issue: Firebase Initialization Error
- **Cause:** Missing or invalid Firebase service account JSON
- **Solution:** Verify the service account file path and contents

### Issue: Image Upload Fails
- **Cause:** Invalid Cloudinary credentials
- **Solution:** Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env`

### Issue: AI Server Unreachable
- **Cause:** Incorrect `AI_SERVER` URL in `.env`
- **Solution:** Verify the AI server is running and the URL is correct

---

## 📝 Example Usage

### Using cURL

```bash
# Get queue status
curl http://localhost:3000/queue

# Generate images
curl -X POST http://localhost:3000/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompts": ["A red summer dress"]}'

# Check result
curl http://localhost:3000/result/task_123abc \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user designs
curl http://localhost:3000/my-designs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript/Fetch

```javascript
const BASE_URL = 'http://localhost:3000';
const TOKEN = 'your_firebase_token';

// Generate images
const generateImages = async () => {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompts: ['A black leather jacket', 'Red summer dress']
    })
  });
  const data = await res.json();
  console.log(data); // { tasks: [...] }
};

// Check result
const checkResult = async (taskId) => {
  const res = await fetch(`${BASE_URL}/result/${taskId}`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  const data = await res.json();
  console.log(data); // { status: 'done', imageUrl: '...', prompt: '...' }
};
```

---
