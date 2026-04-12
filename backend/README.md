# Event Resource Management System - Backend

A secure, cloud-ready backend API for managing event resources, equipment, and vendor materials.

## Features

- 🔐 Secure authentication with JWT
- 🔑 Two-factor authentication (2FA) support
- 👥 Role-based access control (RBAC)
- 📦 Resource & inventory management
- 📅 Event management
- 🏢 Vendor management
- 📊 Usage logging and reporting
- 🔒 HTTPS/TLS ready
- 🚀 Cloud deployment ready

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + TOTP 2FA
- **Security**: bcrypt, helmet, rate-limiting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database (optional)
npm run seed
```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api`

### Database Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (DB GUI)
npm run prisma:studio

# Seed the database
npm run seed
```

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/confirm` - Confirm 2FA setup
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/profile` - Get current user profile

### Events Routes (Require Authentication)

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (EVENT_MANAGER+)
- `PUT /api/events/:id` - Update event (EVENT_MANAGER+)
- `DELETE /api/events/:id` - Delete event (EVENT_MANAGER+)

### Event Resources Routes

- `GET /api/events/:eventId/resources` - Get event resources
- `POST /api/events/:eventId/resources` - Allocate resource (EVENT_MANAGER+)
- `PUT /api/events/:eventId/resources/:resourceId` - Update allocation (EVENT_MANAGER+)
- `DELETE /api/events/:eventId/resources/:resourceId` - Remove allocation (EVENT_MANAGER+)

### Vendors Routes

- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor (EVENT_MANAGER+)
- `PUT /api/vendors/:id` - Update vendor (EVENT_MANAGER+)
- `DELETE /api/vendors/:id` - Delete vendor (EVENT_MANAGER+)

### Resources Routes

- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (EVENT_MANAGER+)
- `PUT /api/resources/:id` - Update resource (EVENT_MANAGER+)
- `DELETE /api/resources/:id` - Delete resource (EVENT_MANAGER+)
- `GET /api/resources/:id/usage` - Get usage logs
- `POST /api/resources/:id/usage` - Log usage (STAFF+)

### Reports Routes

- `GET /api/reports/events/:eventId/usage` - Resource usage by event
- `GET /api/reports/vendors/usage` - Vendor-based usage
- `GET /api/reports/inventory/availability` - Inventory availability
- `GET /api/reports/usage/timeline` - Usage over time
- `GET /api/reports/alerts/low-stock` - Low stock alerts

## User Roles

- **ADMIN**: Full system access
- **EVENT_MANAGER**: Can manage events, vendors, and resources
- **STAFF**: Can log resource usage
- **VIEWER**: Read-only access

## Default Login Credentials

After seeding the database:

- **Admin**: `admin@example.com` / `Admin123!`
- **Manager**: `manager@example.com` / `Manager123!`

**⚠️ Change these credentials in production!**

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- TOTP-based 2FA
- Rate limiting on auth endpoints
- CORS protection
- Helmet security headers
- Input validation
- HTTPS/TLS ready

## Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Environment Variables

See `.env.example` for required environment variables.

## License

ISC
