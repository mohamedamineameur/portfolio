# Portfolio Server

Backend server for the portfolio application.

## Architecture

This server follows a production-grade architecture with:
- Clean separation of concerns (routes → controllers → services → database)
- Server-side session authentication (no JWT, no localStorage)
- Strict input validation with Zod
- TypeScript with strict mode
- Sequelize ORM with SQLite
- Comprehensive error handling
- Rate limiting
- Email notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
npm run dev
```

The database will be automatically synced on startup.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Technologies
- `GET /api/technologies` - List all technologies
- `GET /api/technologies/:id` - Get technology by ID
- `POST /api/technologies` - Create technology (protected)
- `PUT /api/technologies/:id` - Update technology (protected)
- `DELETE /api/technologies/:id` - Delete technology (protected)

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - List all contacts (protected)
- `GET /api/contacts/:id` - Get contact by ID (protected)
- `PATCH /api/contacts/:id/read` - Mark contact as read (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

## Testing

Tests use an in-memory SQLite database and are completely isolated. Each test resets the database state.

```bash
npm test
```

## Security

- Server-side sessions only
- HTTP-only cookies
- Strict input validation
- Rate limiting on all endpoints
- Password hashing with bcrypt
- CORS configured
- Secure cookies in production
