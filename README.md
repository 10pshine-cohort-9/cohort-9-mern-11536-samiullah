# cohort-9-mern-11536-samiullah
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Samiullah

# ZenNotes — Enterprise Notes Management System

A production-grade, full-stack Notes Management application inspired by **Notion**, **Google Keep**, **Evernote**, and **Linear**. Built with a clean MVC architecture backend and a modern SaaS-quality React frontend.

---

## ✨ Features

### Frontend
- **Dark / Light Mode** with system preference detection and persistence
- **Rich Text Editing** via React Quill (headings, bold, italic, code blocks, lists, images, alignment)
- **Global Search** with debounced real-time filtering
- **Category / Tag Filtering** from the sidebar
- **Sort Options**: Newest, Oldest, Alphabetical, Recently Updated
- **Pinned Notes** displayed separately at the top of the workspace
- **Glassmorphism UI** with Framer Motion page transitions and micro-animations
- **Color Labels** for visual note categorization (8 colors)
- **Per-Note Actions**: Edit, Pin, Duplicate, Archive, Trash, Restore, Permanent Delete
- **Export per Note**: PDF, Markdown, CSV
- **Bulk Export / Import**: JSON workspace backup and restore
- **Keyboard Shortcuts**: `Ctrl+N` (new note), `Ctrl+F` (search focus), `Esc` (close modal)
- **Grid & List View Switcher**
- **Skeleton Loaders** and empty state illustrations
- **Toast Notifications** with Undo action for trash operations
- **Error Boundaries** for graceful runtime error handling
- **Lazy Loading / Code Splitting** for optimal performance

### Backend
- **Clean MVC Architecture**: Controllers → Services → Repositories
- **Dual Database Engine**: Automatically connects to MySQL if available, falls back to embedded **SQLite** for zero-config local development
- **JWT Authentication** with `bcryptjs` password hashing
- **Pino Logger** with structured JSON log output to `backend/logs/app.log`
- **Rate Limiting** (auth: 30/15min, API: 500/15min)
- **Express Validator** for strict input validation on all endpoints
- **Helmet** for secure HTTP headers
- **CORS** configured for React dev server proxy
- **Centralized Error Handler** with standardized JSON error responses
- **Mocha + Chai + Supertest** integration test suite (9/9 passing)

---

## 🗂️ Project Structure

```
New folder/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── server.js          # Server entry point
│   │   ├── config/
│   │   │   ├── db.js          # MySQL/SQLite dual database driver
│   │   │   └── logger.js      # Pino structured logger
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   └── NoteController.js
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   └── NoteService.js
│   │   ├── repositories/
│   │   │   ├── UserRepository.js
│   │   │   └── NoteRepository.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── noteRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   └── noteValidator.js
│   │   └── utils/
│   │       ├── apiResponse.js
│   │       ├── jwt.js
│   │       └── password.js
│   ├── tests/
│   │   ├── auth.test.js        # Auth API Mocha tests
│   │   └── notes.test.js       # Notes CRUD Mocha tests
│   ├── logs/                   # Auto-created at runtime
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/                   # React + Vite + Tailwind Application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.jsx           # React DOM entry point
│   │   ├── App.jsx            # Router + Providers + Toaster
│   │   ├── index.css          # Tailwind base + glassmorphism utilities
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotesContext.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios with JWT interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteEditorModal.jsx
│   │   │   ├── KeyboardShortcutsModal.jsx
│   │   │   ├── ImportExportModal.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   └── __tests__/
│   │       └── notes.test.js   # Jest unit test suite
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql             # MySQL DDL migration script
│   └── seed.sql               # Sample data seed script
│
├── sonar-project.properties   # SonarQube configuration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **MySQL** (optional — app falls back to SQLite automatically)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "New folder"
```

### 2. Setup & Run Backend

```bash
cd backend
npm install
```

Configure your `.env` file (already created with defaults):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_production_key_antigravity_2026
JWT_EXPIRES_IN=7d
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=notes_db
```

> **Note**: If MySQL is not running or credentials are incorrect, the server automatically initializes an embedded SQLite database at `backend/logs/notes.db`. No additional configuration needed.

**If using MySQL**, first run the migration:
```bash
mysql -u root -p < ../database/schema.sql
mysql -u root -p notes_db < ../database/seed.sql
```

Start the backend server:
```bash
npm run dev
```

Backend will start at **http://localhost:5000**

### 3. Setup & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at **http://localhost:3000**

The Vite dev server automatically proxies `/api/*` requests to `http://localhost:5000`.

---

## 🧪 Running Tests

### Backend Tests (Mocha + Chai + Supertest)
```bash
cd backend
npm test
```
**9/9 tests passing** (Auth Suite: 4, Notes CRUD Suite: 5)

### Frontend Tests (Jest)
```bash
cd frontend
npm test
```
Unit tests cover: note validation, auth utilities, sorting logic, color parsing, localStorage cleanup.

---

## 📡 API Reference

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `POST` | `/api/auth/logout` | Yes | Logout session |
| `GET` | `/api/auth/profile` | Yes | Get current user profile |
| `PUT` | `/api/auth/profile` | Yes | Update user profile info |
| `PUT` | `/api/auth/change-password` | Yes | Change user password |

### Notes Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notes` | Yes | Fetch notes (supports `?status`, `?search`, `?category`, `?tag`, `?sort`) |
| `POST` | `/api/notes` | Yes | Create a new note |
| `GET` | `/api/notes/:id` | Yes | Get single note by ID |
| `PUT` | `/api/notes/:id` | Yes | Update note fields |
| `DELETE` | `/api/notes/:id` | Yes | Soft delete (move to trash) |
| `DELETE` | `/api/notes/:id/permanent` | Yes | Permanently delete note |
| `PATCH` | `/api/notes/archive/:id` | Yes | Toggle archive status |
| `PATCH` | `/api/notes/favorite/:id` | Yes | Toggle favorite status |
| `PATCH` | `/api/notes/restore/:id` | Yes | Restore from trash |
| `POST` | `/api/notes/duplicate/:id` | Yes | Duplicate a note |

#### Notes Query Parameters
- `?status=active` (default), `favorites`, `archived`, `trash`
- `?search=keyword` — full-text search across title, content, tags
- `?category=Work` — filter by category
- `?tag=react` — filter by tag substring
- `?sort=newest` (default), `oldest`, `alphabetical`, `updated`

### Standard Response Format
```json
// Success
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Validation Error",
  "errors": [ ... ]
}
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| SQL Injection Prevention | Parameterized queries in all DB operations |
| Password Hashing | `bcryptjs` with 10 salt rounds |
| JWT Authentication | Stateless signed tokens, 7-day expiry |
| HTTP Security Headers | `helmet` middleware |
| Rate Limiting | `express-rate-limit` (30 auth, 500 API per 15min) |
| Input Validation | `express-validator` on all POST/PUT routes |
| CORS | Configured and restricted |
| XSS Protection | HTML sanitized via Quill's internal model |

---

## 📊 SonarQube Integration

1. Install SonarQube locally or use SonarCloud.
2. Configure `sonar-project.properties` (root of the project).
3. Run the scanner:
```bash
sonar-scanner
```

The project targets:
- **High Code Coverage** via Mocha + Jest suites
- **Low Technical Debt** through clean layered architecture
- **Zero Critical Vulnerabilities** — no eval, no unsafe patterns

---

## 🎨 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion, React Router v7, Lucide React, React Quill, React Hot Toast, Axios |
| **Backend** | Node.js, Express.js, mysql2, better-sqlite3, jsonwebtoken, bcryptjs, Pino, Helmet, CORS, Express Validator, express-rate-limit |
| **Database** | MySQL (primary), SQLite (automatic fallback) |
| **Testing** | Mocha + Chai + Supertest (backend), Jest (frontend) |
| **Quality** | SonarQube, ESLint, .gitignore, structured logging |

---

## 📝 License

MIT — Cohort 9 MERN Assignment — Samiullah
