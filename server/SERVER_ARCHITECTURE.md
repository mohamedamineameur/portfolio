# Backend Server Architecture

This document describes the **complete backend architecture** of a full-stack portfolio application.
It is written to reflect **real-world, production-grade backend practices**, not tutorial-level code.

The backend is intentionally designed to demonstrate:
- clean and strict separation of concerns
- defensive programming and exact input validation
- server-side authentication with secure sessions
- deterministic and isolated integration testing
- security-first architectural decisions
- professional documentation expected in technical interviews

---

## Project Skeleton (Backend)

The backend follows a **modular, domain-driven structure**.

```txt
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── cors.ts
│   │   ├── database.ts
│   │   ├── session.ts
│   │   ├── passport.ts
│   │   └── mailer.ts
│   │
│   ├── database/
│   │   ├── sequelize.ts
│   │   └── models/
│   │       ├── index.ts
│   │       ├── User.model.ts
│   │       ├── Project.model.ts
│   │       ├── Technology.model.ts
│   │       └── Contact.model.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── project.routes.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── project.service.ts
│   │   │   └── project.schema.ts
│   │   │
│   │   ├── technologies/
│   │   │   ├── technology.routes.ts
│   │   │   ├── technology.controller.ts
│   │   │   └── technology.service.ts
│   │   │
│   │   └── contacts/
│   │       ├── contact.routes.ts
│   │       ├── contact.controller.ts
│   │       ├── contact.service.ts
│   │       └── contact.schema.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── upload.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/
│   │   ├── hash.ts
│   │   ├── logger.ts
│   │   └── mailTemplates.ts
│   │
│   └── types/
│       ├── express.d.ts
│       └── session.d.ts
│
├── tests/
│   ├── setup.ts
│   ├── fixtures/
│   │   └── user.fixture.ts
│   ├── auth.test.ts
│   ├── projects.test.ts
│   └── contact.test.ts
│
├── uploads/
│   └── .gitkeep
│
├── .env.example
├── jest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Responsibilities of the Backend

The backend is responsible for:
- managing portfolio content (projects, technologies)
- handling authentication and authorization using server-side sessions
- validating all external inputs (body, params, query)
- handling contact form submissions
- sending transactional emails
- handling secure file uploads
- enforcing security constraints
- providing reliable and isolated integration tests

---

## Technology Stack (With Justification)

### Runtime & Language
- **Node.js**
  - Non-blocking I/O
  - Mature ecosystem
- **TypeScript**
  - Static typing
  - Safer refactoring
  - Self-documenting APIs

### Web Framework
- **Express**
  - Explicit middleware pipeline
  - Full control over request lifecycle
  - Predictable and debuggable behavior

### Database & ORM
- **Sequelize**
  - ORM abstraction
  - Transaction support
  - Clear model definitions
- **SQLite**
  - File-based database for development
  - In-memory database for tests

---

## Sequelize Configuration

```ts
// src/database/sequelize.ts
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage:
    process.env.NODE_ENV === "test"
      ? ":memory:"
      : "database.sqlite",
  logging: false,
});
```

---

## Authentication & Sessions (Server-Side Only)

### Strategy
- Server-side sessions
- No JWT
- No localStorage
- No session data exposed to the client

### Libraries Used
- express-session
- connect-session-sequelize
- passport
- passport-local
- bcrypt

### Session Configuration

```ts
// src/config/session.ts
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import { sequelize } from "../database/sequelize";

const SequelizeStore = connectSessionSequelize(session.Store);

export const sessionMiddleware = session({
  name: "session_id",
  secret: process.env.SESSION_SECRET!,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});
```

---

## Input Validation (Exact – No More, No Less)

All external inputs are validated using **Zod**.
- Unknown fields are rejected
- Missing fields are rejected

```ts
// src/modules/projects/project.schema.ts
import { z } from "zod";

export const createProjectSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(10),
    url: z.string().url(),
    githubUrl: z.string().url().optional(),
    published: z.boolean(),
  })
  .strict();
```

---

## Integration Testing (In-Memory Database)

### Rules
- No file-based SQLite for tests
- Use `:memory:` database
- Database reset after **each test and sub-test**
- No shared state
- Deterministic fixtures

### Test Lifecycle

```ts
// tests/setup.ts
import { sequelize } from "../src/database/sequelize";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await sequelize.drop();
});
```

---

## Fixtures (Isolated)

```ts
// tests/fixtures/user.fixture.ts
import bcrypt from "bcrypt";
import { User } from "../../src/database/models/User.model";

export async function createUser() {
  return User.create({
    email: "test@test.com",
    password: await bcrypt.hash("password", 10),
  });
}
```

---

## Security Principles

- Server-side sessions only
- HTTP-only cookies
- No JWT
- No localStorage
- Strict input validation
- Rate limiting
- No sensitive data in logs

---

## Conclusion

This backend architecture reflects **real-world backend engineering**:
- secure by default
- testable by design
- strict by construction
- maintainable at scale
