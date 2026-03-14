(https://github.com/ttanu03/mentora-backend/wiki)-API Testing

# 🎓 Mentora Backend

**A production-ready REST API for a mentorship platform**

Built with Node.js · Express · MongoDB · JWT · Claude AI

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</div>

---

## 📖 Overview

Mentora is a backend API for a mentorship platform where **parents**, **students**, and **mentors** interact. Parents enroll their children into lessons taught by mentors. The platform also includes an AI-powered text summarization endpoint using Anthropic Claude (or OpenAI).

> This is a pure REST API — no frontend. It is designed to be consumed by a mobile app, web app, or tested via tools like Hoppscotch or Postman.

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Parent** | Signs up, creates student profiles for their children, books lessons |
| **Mentor** | Signs up, creates lessons and sessions |
| **Student** | Not a login account — a profile created and managed by a parent |

---

## ✨ Features

- 🔐 JWT Authentication with bcrypt password hashing
- 👨‍👩‍👧 Parent creates and manages student profiles
- 📚 Mentors create lessons and sessions
- 📅 Parents book students into lessons
- 🎯 Session attendance tracking (bonus)
- 🤖 AI-powered text summarization via Anthropic Claude or OpenAI
- 🛡️ Role-based access control on every route
- ✅ Input validation with detailed error messages
- ⚡ Rate limiting on AI endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |
| LLM Integration | Anthropic Claude / OpenAI |
| Dev Server | Nodemon |

---

## 📁 Project Structure

```
mentora-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # signup, login, getMe
│   │   ├── studentController.js  # create & list students
│   │   ├── lessonController.js   # create & list lessons
│   │   ├── bookingController.js  # book student into lesson
│   │   ├── sessionController.js  # create sessions, join session
│   │   └── llmController.js      # AI summarization endpoint
│   ├── middleware/
│   │   ├── auth.js               # JWT verify + requireRole guard
│   │   └── validate.js           # express-validator error formatter
│   ├── models/
│   │   ├── User.js               # parent | mentor accounts
│   │   ├── Student.js            # student profiles (owned by parent)
│   │   ├── Lesson.js             # lessons created by mentors
│   │   ├── Booking.js            # student ↔ lesson assignments
│   │   └── Session.js            # individual class sessions
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── lessons.js
│   │   ├── bookings.js
│   │   ├── sessions.js
│   │   └── llm.js
│   ├── services/
│   │   └── llmService.js         # Anthropic / OpenAI abstraction layer
│   └── index.js                  # App entry point
├── .env.example                  # Environment variable template
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js v18 or higher** — [Download here](https://nodejs.org)
  ```bash
  # Check your version
  node --version
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- **MongoDB** — either local or cloud (Atlas)
  - Local: [Install MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud (free): [MongoDB Atlas](https://www.mongodb.com/atlas) — recommended for beginners

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/mentora-backend.git
cd mentora-backend
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json` including:
- express, mongoose, jsonwebtoken, bcryptjs
- express-validator, express-rate-limit
- node-fetch, dotenv
- nodemon (dev dependency)

---

### Step 3 — Install Nodemon (if not already installed)

Nodemon automatically restarts the server whenever you save a file. It is already listed as a dev dependency, so `npm install` should handle it. But if you want it globally:

```bash
# Install globally (optional but convenient)
npm install -g nodemon

# Verify installation
nodemon --version
```

> **What is Nodemon?**
> Normally you'd have to stop and restart `node` every time you change a file.
> Nodemon watches your files and restarts automatically — making development much faster.

---

### Step 4 — Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
# Server
PORT=3000

# MongoDB — use your local or Atlas connection string
MONGODB_URI=mongodb://localhost:27017/mentora

# JWT — use any long random string (keep this secret!)
JWT_SECRET=your_super_secret_key_at_least_32_chars_long
JWT_EXPIRES_IN=7d

# LLM Provider — choose "anthropic" or "openai"
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Uncomment below if using OpenAI instead
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-your-openai-key-here
```

> ⚠️ **Important:** Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

### Step 5 — Start MongoDB (if running locally)

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu / Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

If using **MongoDB Atlas**, skip this step — just paste your Atlas connection string into `MONGODB_URI`.

---

### Step 6 — Run the Server

```bash
# Development mode — auto restarts on file changes (uses nodemon)
npm run dev

# Production mode — runs with plain node
npm start
```

You should see:
```
[nodemon] starting `node src/index.js`
MongoDB connected: localhost
Mentora API running on port 3000
```

The API is now live at: **`http://localhost:3000`**

---

## 🔧 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon src/index.js` | Start with auto-reload (development) |
| `npm start` | `node src/index.js` | Start without auto-reload (production) |

---

## 🌍 Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port the server listens on |
| `MONGODB_URI` | ✅ Yes | — | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | — | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | How long tokens stay valid |
| `LLM_PROVIDER` | No | `anthropic` | `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` | If Anthropic | — | Your Anthropic API key |
| `OPENAI_API_KEY` | If OpenAI | — | Your OpenAI API key |

---

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

### Authentication
All protected routes (marked 🔒) require this header:
```
Authorization: Bearer <your_jwt_token>
```

> **How to get a token:** Call `POST /auth/login` or `POST /auth/signup` — the response includes a `token` field. Copy that value and use it in the Authorization header.

---

### 🔑 Auth Endpoints

#### `POST /auth/signup`
Register a new parent or mentor account.

> ⚠️ Only `parent` and `mentor` roles can sign up. Students are created by parents.

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "password": "password123",
  "role": "parent"
}
```

**Success Response `201`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "role": "parent",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` — Validation error (missing fields, invalid email, password too short)
- `409` — Email already in use

---

#### `POST /auth/login`
Log in and receive a JWT token.

**Request Body:**
```json
{
  "email": "sarah@example.com",
  "password": "password123"
}
```

**Success Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Sarah Johnson",
    "role": "parent"
  }
}
```

**Error Responses:**
- `401` — Invalid email or password

---

#### `GET /auth/me` 🔒
Get the currently authenticated user's profile.

**Success Response `200`:**
```json
{
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "role": "parent"
  }
}
```

---

### 👦 Student Endpoints *(Parent only)*

#### `POST /students` 🔒
Create a student profile under the authenticated parent.

**Request Body:**
```json
{
  "name": "Tommy Johnson",
  "age": 10,
  "grade": "5th"
}
```

**Success Response `201`:**
```json
{
  "student": {
    "_id": "64a1b2c3d4e5f6789abc5678",
    "name": "Tommy Johnson",
    "age": 10,
    "grade": "5th",
    "parent": "64a1b2c3d4e5f6789abc1234"
  }
}
```

---

#### `GET /students` 🔒
Get all students belonging to the authenticated parent.

**Success Response `200`:**
```json
{
  "students": [
    {
      "_id": "64a1b2c3d4e5f6789abc5678",
      "name": "Tommy Johnson",
      "age": 10,
      "grade": "5th"
    }
  ]
}
```

---

### 📚 Lesson Endpoints

#### `POST /lessons` 🔒 *(Mentor only)*
Create a new lesson.

**Request Body:**
```json
{
  "title": "Intro to Algebra",
  "description": "Learn the basics of variables, expressions and simple equations"
}
```

**Success Response `201`:**
```json
{
  "lesson": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "title": "Intro to Algebra",
    "description": "Learn the basics of variables, expressions and simple equations",
    "mentor": "64a1b2c3d4e5f6789abc9999"
  }
}
```

---

#### `GET /lessons` 🔒
Get all available lessons. Accessible to all authenticated users.

**Success Response `200`:**
```json
{
  "lessons": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "title": "Intro to Algebra",
      "description": "Learn the basics of variables...",
      "mentor": {
        "_id": "64a1b2c3d4e5f6789abc9999",
        "name": "John Mentor",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### 📅 Booking Endpoints *(Parent only)*

#### `POST /bookings` 🔒
Assign one of your students to a lesson.

**Request Body:**
```json
{
  "studentId": "64a1b2c3d4e5f6789abc5678",
  "lessonId": "64a1b2c3d4e5f6789abcdef0"
}
```

**Success Response `201`:**
```json
{
  "booking": {
    "_id": "64a1b2c3d4e5f6789abcffff",
    "student": { "_id": "...", "name": "Tommy Johnson" },
    "lesson": { "_id": "...", "title": "Intro to Algebra" },
    "bookedBy": "64a1b2c3d4e5f6789abc1234"
  }
}
```

**Error Responses:**
- `403` — Student does not belong to you
- `404` — Lesson not found
- `409` — Student already booked for this lesson

---

#### `GET /bookings` 🔒
Get all bookings for your students.

---

### 🗓️ Session Endpoints

#### `POST /sessions` 🔒 *(Mentor only)*
Create a session under one of your lessons.

**Request Body:**
```json
{
  "lessonId": "64a1b2c3d4e5f6789abcdef0",
  "date": "2025-09-01T10:00:00Z",
  "topic": "Chapter 1 — Variables and Expressions",
  "summary": "Students were introduced to variables and practiced substitution."
}
```

**Success Response `201`:**
```json
{
  "session": {
    "_id": "64a1b2c3d4e5f6789abceeee",
    "lesson": "64a1b2c3d4e5f6789abcdef0",
    "date": "2025-09-01T10:00:00.000Z",
    "topic": "Chapter 1 — Variables and Expressions",
    "summary": "Students were introduced to variables...",
    "attendees": []
  }
}
```

---

#### `GET /lessons/:id/sessions` 🔒
Get all sessions for a specific lesson, sorted by date.

**Example:**
```
GET /lessons/64a1b2c3d4e5f6789abcdef0/sessions
```

---

#### `POST /sessions/:id/join` 🔒 *(Parent only)*
Enrol a booked student into a session.

**Request Body:**
```json
{
  "studentId": "64a1b2c3d4e5f6789abc5678"
}
```

> The student must already have a booking for the lesson this session belongs to.

---

### 🤖 LLM Summarization

#### `POST /llm/summarize` 🔒
Send any block of text and receive an AI-generated bullet-point summary.

**Rate limit:** 10 requests per minute per IP address.

**Request Body:**
```json
{
  "text": "Your long text here (minimum 50 characters, maximum 10,000 characters)..."
}
```

**Success Response `200`:**
```json
{
  "summary": "• Photosynthesis converts sunlight, water, and CO₂ into sugar and oxygen\n• It primarily occurs in plant leaves within chloroplasts\n• Chlorophyll captures the light energy needed for the process\n• Light-dependent reactions occur in thylakoid membranes\n• The Calvin cycle fixes carbon and takes place in the stroma",
  "model": "claude-haiku-4-5-20251001"
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | `text` is missing, empty, or under 50 characters |
| `413` | `text` exceeds 10,000 characters |
| `429` | Rate limit exceeded — wait 1 minute |
| `502` | LLM provider API call failed |

---

## 🧪 Testing with Hoppscotch

[Hoppscotch](https://hoppscotch.io) is a free browser-based API testing tool (like Postman).

### Recommended Test Flow

```
1.  POST /auth/signup       → sign up as parent   → copy token
2.  POST /auth/signup       → sign up as mentor    → copy mentor token
3.  GET  /auth/me           → verify parent token works
4.  POST /students          → create a student     → copy student _id
5.  GET  /students          → list your students
6.  POST /lessons           → create a lesson (use mentor token) → copy lesson _id
7.  GET  /lessons           → browse all lessons
8.  POST /bookings          → book student into lesson
9.  GET  /bookings          → list your bookings
10. POST /sessions          → create session (mentor token) → copy session _id
11. GET  /lessons/:id/sessions → list sessions
12. POST /sessions/:id/join → join session as student
13. POST /llm/summarize     → test AI summarization
```

### Setting the Auth Header in Hoppscotch

In every protected request, go to the **Authorization** tab:
- Type: `Bearer Token`
- Token: paste your JWT token (no "Bearer" prefix needed — Hoppscotch adds it)

---

## 🗄️ Database Schema

```
User (role: parent | mentor)
  │
  └──▶ Student (parent → User._id)
            │
            └──▶ Booking (student → Student._id, lesson → Lesson._id)
                           │
                           └──▶ Session.attendees[]

Lesson (mentor → User._id)
  │
  └──▶ Session (lesson → Lesson._id)
```

**Indexes:**
- `Booking`: unique compound index on `(student, lesson)` — prevents duplicate bookings

---

## 🔒 Security Practices

- Passwords hashed with **bcrypt** at 12 salt rounds — never stored in plain text
- JWT tokens signed with a secret stored in environment variables only
- API keys (Anthropic/OpenAI) loaded from `.env` — never hardcoded
- `.env` is in `.gitignore` — never committed to version control
- Role-based access control enforced via middleware on every protected route
- Input validation rejects bad data before it reaches the database
- Rate limiting on the LLM endpoint prevents abuse and runaway API costs
- Duplicate bookings blocked at the database index level

---

## 🤔 Design Decisions & Assumptions

- Only `parent` and `mentor` can self-register. Students are always created by a parent — they are profiles, not accounts.
- A mentor can only add sessions to lessons they personally created.
- A parent can only book their own students — ownership is verified server-side on every request.
- `GET /lessons` is accessible to all authenticated roles so parents can browse before booking.
- The LLM summarization returns 3–6 bullet points for consistency regardless of input length.
- Text length for summarization is capped at 10,000 characters (configurable in `src/controllers/llmController.js`).
- The LLM provider is swappable via a single environment variable — no code changes needed.

---

## 📦 Dependencies

```json
{
  "bcryptjs": "password hashing",
  "dotenv": "environment variable loading",
  "express": "web framework",
  "express-rate-limit": "rate limiting for LLM endpoint",
  "express-validator": "request body validation",
  "jsonwebtoken": "JWT creation and verification",
  "mongoose": "MongoDB ODM",
  "node-fetch": "HTTP requests to LLM providers"
}
```

Dev dependencies:
```json
{
  "nodemon": "auto-restarts server on file changes during development"
}
```

---

## 🐛 Common Issues

**`MONGODB_URI` is undefined on startup**
→ Make sure `.env` file exists in the project root (same folder as `package.json`). Run `cp .env.example .env` and fill it in.

**`jwt malformed` error on protected routes**
→ Your token is not being sent correctly. In Hoppscotch, use the Authorization tab → Bearer Token → paste just the token without the word "Bearer".

**`Invalid or expired token`**
→ You may have gotten the token before `JWT_SECRET` was set in `.env`. Log in again after confirming the secret is loaded.

**Nodemon not found**
→ Run `npm install` inside the project folder, or install globally with `npm install -g nodemon`.

**Port 3000 already in use**
→ Change `PORT=3001` in your `.env` file, or kill the process using port 3000.

---

## 📄 License

MIT — free to use and modify.

---

<div align="center">
Built for the Mentora platform backend task
</div>
