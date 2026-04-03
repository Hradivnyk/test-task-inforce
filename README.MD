# Inforce Test Task API

REST API built with Node.js and Express for managing books and users, featuring JWT authentication and role-based access control.

## Tech Stack

- **Runtime:** Node.js (ESM — `"type": "module"`)
- **Framework:** Express 5
- **Database:** MongoDB / Mongoose 9
- **Authentication:** JWT (`jsonwebtoken`) + bcrypt
- **Validation:** Zod
- **Logging:** Pino + pino-http (pretty output in dev)
- **Security:** Helmet, CORS, express-rate-limit
- **Documentation:** Swagger UI (OpenAPI 3.0.3)
- **Testing:** Jest + supertest + mongodb-memory-server
- **Code Quality:** ESLint, Prettier, Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or remote)

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | `development` / `production` | `development` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |
| `DATABASE_URL` | MongoDB connection string | — (required) |
| `JWT_SECRET` | Secret key for signing tokens | — (required) |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |

### Running the Server

Development (auto-restart via Nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Endpoints

### Auth (public)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Books (authenticated)

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/books` | Any user | List books (paginated) |
| GET | `/api/books/:id` | Any user | Get a book by ID |
| POST | `/api/books` | Admin | Create a book |
| PUT | `/api/books/:id` | Admin | Update a book |
| DELETE | `/api/books/:id` | Admin | Delete a book |

### Users (admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List users (paginated) |
| GET | `/api/users/:id` | Get a user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

All authenticated endpoints require a `Bearer` token in the `Authorization` header.

## API Documentation (Swagger)

Swagger UI is available in non-production environments at:

```
http://localhost:3000/api/docs
```

The OpenAPI spec is defined in `src/docs/swagger.yaml`.

## Testing

Tests use an in-memory MongoDB instance (`mongodb-memory-server`), so no external database is needed.

Run all tests:

```bash
npm test
```

Run in watch mode:

```bash
npm run test:watch
```

### Test Coverage

| Suite | What is tested |
|---|---|
| `auth.test.js` | Signup, login, validation errors, duplicate email handling |
| `books.test.js` | CRUD operations, admin vs user permissions, validation, 404 handling |
| `users.test.js` | CRUD operations, role-based access, validation, password omission |
| `middleware.test.js` | JWT authentication, role authorization |

## Project Structure

```
src/
├── index.js                  # Server entry point
├── app.js                    # Express app setup
├── config/
│   ├── index.js              # Environment config with validation
│   ├── database.js           # MongoDB connection
│   ├── cors.js               # CORS options
│   ├── rateLimiter.js        # Rate limiting (active in production)
│   └── swagger.js            # Swagger spec loader
├── controllers/
│   ├── auth.controller.js
│   ├── book.controller.js
│   └── user.controller.js
├── docs/
│   └── swagger.yaml          # OpenAPI 3.0.3 specification
├── middlewares/
│   ├── auth.middleware.js     # JWT verification
│   ├── role.middleware.js     # Role-based access control
│   ├── validate.js           # Zod request validation
│   └── errorHandler.js       # Global error handler
├── models/
│   ├── book.model.js         # Book schema (name, author, pageCount)
│   └── user.model.js         # User schema (name, email, password, role)
├── routes/
│   ├── auth.routes.js
│   ├── book.routes.js
│   └── user.routes.js
├── services/
│   ├── auth.service.js
│   ├── book.service.js
│   └── user.service.js
├── utils/
│   ├── AppError.js           # Custom error class
│   ├── catchAsync.js         # Async error wrapper
│   ├── logger.js             # Pino logger
│   ├── mongoUtils.js         # ObjectId validation, error mapping
│   └── renderMarkdown.js     # Markdown-to-HTML renderer
└── validators/
    ├── auth.validator.js
    ├── book.validator.js
    └── user.validator.js

tests/
├── setup.js                  # In-memory MongoDB setup/teardown
├── auth.test.js
├── books.test.js
├── users.test.js
└── middleware.test.js
```

## Code Quality

Lint the codebase:

```bash
npm run lint
npm run lint:fix
```

Format with Prettier:

```bash
npm run format
npm run format:check
```

### Git Hooks (Husky)

- **pre-commit** — runs `lint-staged` (ESLint + Prettier on staged `.js` files)
- **pre-push** — runs the full test suite
