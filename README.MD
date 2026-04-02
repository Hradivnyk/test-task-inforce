# Inforce Test Task

A small Node.js + Express application with Jest-based tests using `supertest`.

## Tech Stack

- Node.js (ESM: `"type": "module"`)
- Express (server + routes)
- Jest (unit/integration tests)
- `supertest` (HTTP request emulation against the Express app)
- Nodemon (development auto-restart)
- ESLint + Prettier (code quality)

## Getting Started

Install dependencies:

```bash
npm install
```

### Development

Runs the server with auto-restart:

```bash
npm run dev
```

### Production

```bash
npm start
```

## Configuration

The server listens on `process.env.PORT` (default: `3000`).

## Tests

Tests are written with Jest and use `supertest` to exercise HTTP behavior without manually starting a real server.

Run all tests:

```bash
npm test
```

Run in watch mode:

```bash
npm run test:watch
```

## Project Structure

- `src/app.js` - Express app (routes + middleware) exported for reuse in tests
- `src/index.js` - Server startup (`app.listen(...)`)
- `tests/app.test.js` - Jest tests
- `eslint.config.js` - ESLint configuration