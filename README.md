# Mentora Backend

A RESTful API for a mentorship platform where **parents**, **students**, and **mentors** interact. Built with Node.js, Express, MongoDB, and JWT authentication.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB (via Mongoose) |
| Auth | JWT + bcryptjs |
| LLM | Anthropic Claude (or OpenAI) |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |

---

## Project Structure

```
src/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── lessonController.js
│   ├── bookingController.js
│   ├── sessionController.js
│   └── llmController.js
├── middleware/
│   ├── auth.js             # JWT authentication + role guard
│   └── validate.js         # express-validator error handler
├── models/
│   ├── User.js             # parent | mentor
│   ├── Student.js          # belongs to a parent
│   ├── Lesson.js           # created by a mentor
│   ├── Booking.js          # student ↔ lesson assignment
│   └── Session.js          # individual class session
├── routes/
│   ├── auth.js
│   ├── students.js
│   ├── lessons.js
│   ├── bookings.js
│   ├── sessions.js
│   └── llm.js
├── services/
│   └── llmService.js       # Anthropic / OpenAI abstraction
└── index.js                # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone & install

```bash
git clone https://github.com/your-username/mentora-backend.git
cd mentora-backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mentora
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# LLM provider: "anthropic" (default) or "openai"
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...       # required if LLM_PROVIDER=anthropic
# OPENAI_API_KEY=sk-...            # required if LLM_PROVIDER=openai
```

### 3. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 3000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | No | Token TTL (default: `7d`) |
| `LLM_PROVIDER` | No | `anthropic` or `openai` (default: `anthropic`) |
| `ANTHROPIC_API_KEY` | If using Anthropic | Your Anthropic API key |
| `OPENAI_API_KEY` | If using OpenAI | Your OpenAI API key |

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

### Auth

#### `POST /auth/signup`
Register a new **parent** or **mentor** (students are created by parents).

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "parent"
}
```
`role` must be `"parent"` or `"mentor"`.

**Response `201`:**
```json
{ "token": "...", "user": { "_id": "...", "name": "Jane Doe", "role": "parent" } }
```

---

#### `POST /auth/login`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{ "token": "...", "user": { ... } }
```

---

#### `GET /auth/me` 🔒

Returns the currently authenticated user.

---

### Students *(parent only)*

#### `POST /students` 🔒

```json
{ "name": "Alice", "age": 10, "grade": "5th" }
```

#### `GET /students` 🔒

Returns all students belonging to the authenticated parent.

---

### Lessons

#### `POST /lessons` 🔒 *(mentor only)*

```json
{ "title": "Intro to Algebra", "description": "Covers variables and expressions" }
```

#### `GET /lessons` 🔒

Returns all lessons with mentor details. Accessible to all authenticated users.

---

### Bookings *(parent only)*

#### `POST /bookings` 🔒

Assigns one of the parent's students to a lesson.

```json
{ "studentId": "<mongo_id>", "lessonId": "<mongo_id>" }
```

Returns `409` if the student is already booked for that lesson.

#### `GET /bookings` 🔒

Returns all bookings for the authenticated parent's students.

---

### Sessions

#### `POST /sessions` 🔒 *(mentor only)*

Creates a session under a lesson the mentor owns.

```json
{
  "lessonId": "<mongo_id>",
  "date": "2025-08-15T10:00:00Z",
  "topic": "Chapter 3 — Equations",
  "summary": "Students practiced solving linear equations."
}
```

#### `GET /lessons/:id/sessions` 🔒

Returns all sessions for a given lesson, sorted by date ascending.

#### `POST /sessions/:id/join` 🔒 *(parent only — bonus)*

Enrols a booked student into a specific session.

```json
{ "studentId": "<mongo_id>" }
```

---

### LLM Summarization

#### `POST /llm/summarize` 🔒

Summarizes a block of text using the configured LLM provider.

**Rate limit:** 10 requests per minute per IP.

**Request body:**
```json
{ "text": "Your long text here..." }
```

**Response `200`:**
```json
{
  "summary": "• Point one\n• Point two\n• Point three",
  "model": "claude-haiku-4-5-20251001"
}
```

**Error responses:**

| Status | Reason |
|---|---|
| `400` | `text` is missing, empty, or shorter than 50 characters |
| `413` | `text` exceeds 10,000 characters |
| `429` | Rate limit exceeded (10 req/min) |
| `502` | LLM provider call failed |

---

### Example curl: LLM Summarize

```bash
curl -X POST http://localhost:3000/llm/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "text": "Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to produce oxygen and energy in the form of sugar. It occurs mainly in leaves, in the chloroplasts, using the green pigment chlorophyll. The light-dependent reactions occur in the thylakoid membranes, while the Calvin cycle takes place in the stroma."
  }'
```

Expected response:
```json
{
  "summary": "• Photosynthesis converts sunlight, water, and CO₂ into sugar and oxygen\n• It primarily occurs in plant leaves within chloroplasts\n• Chlorophyll is the key pigment that captures light energy\n• Light-dependent reactions happen in thylakoid membranes\n• The Calvin cycle, which fixes carbon, takes place in the stroma",
  "model": "claude-haiku-4-5-20251001"
}
```

---

## Database Design

```
User         (role: parent | mentor)
  └─ Student (parent → User)

Lesson       (mentor → User)
  └─ Session (lesson → Lesson)
       └─ attendees: [Student]

Booking      (student → Student, lesson → Lesson, bookedBy → User)
```

---

## Security Practices

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens signed with a secret from environment variables
- API keys loaded from `.env` — never hardcoded
- Role-based access control on every protected route
- Input validated with `express-validator` before hitting business logic
- Duplicate booking prevented via a **unique compound index** on `(student, lesson)`
- Rate limiting on the LLM endpoint to prevent abuse

---

## Assumptions & Design Decisions

- Only `parent` and `mentor` can self-register; students are always created by a parent.
- A mentor can only create sessions for lessons they personally own.
- A parent can only book their own students (ownership verified server-side).
- The LLM summary format is 3–6 bullet points for consistency.
- Text length limit for summarization is set to 10,000 characters (configurable in `llmController.js`).
- `GET /lessons` is open to all authenticated roles so parents can browse available lessons before booking.
