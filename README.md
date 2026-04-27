# Event Resource Management System

A comprehensive, secure, cloud-ready web application for managing event resources, equipment, supplies, and vendor materials with mobile-first design.

## Project Overview and Goals

This project was built to solve a common operations problem for event teams: information about events, inventory, vendors, and resource usage is often spread across spreadsheets, emails, and ad hoc notes. The Event Resource Management System brings those workflows into a single full-stack application so teams can plan events, track inventory, coordinate with vendors, and review operational data from one place.

The main goals of the project were:

- Centralize event, resource, and vendor data in one system.
- Improve security with authenticated access, role-based permissions, and optional two-factor authentication.
- Support day-to-day operational workflows such as resource allocation, usage logging, and low-stock monitoring.
- Provide reporting views that help users make decisions from current inventory and usage data.
- Deliver a responsive interface that remains usable on desktops, laptops, and mobile devices.

## Themes Used

The system was designed around five major themes that shape both the frontend and backend implementation.

### 1. Security and Trust

Security is a core theme of the project rather than an afterthought. The backend uses JWT-based authentication, password hashing, rate limiting, security headers, and TOTP-based two-factor authentication. Role-based access control also ensures that users only see or modify data that matches their responsibilities.

### 2. Operational Workflow Management

The second theme is support for real event operations. Instead of treating events, resources, and vendors as separate disconnected records, the application links them together so teams can create events, assign resources, monitor usage, and keep inventory aligned with actual event activity.

### 3. Reporting and Visibility

Another theme is actionable visibility. The dashboard and reports emphasize totals, usage trends, inventory availability, vendor usage, and low-stock alerts. This helps users move beyond simple data entry and use the system for planning and oversight.

### 4. Responsive, Mobile-Friendly Access

Because event work often happens away from a desk, the project uses a mobile-first responsive interface. The frontend layout, card-based views, and touch-friendly controls were chosen so staff and managers can still use the system effectively on smaller screens.

### 5. Full-Stack Maintainability

The final theme is maintainability. TypeScript is used on both the frontend and backend, Prisma provides a clear data-access layer, and the project is split into focused modules for auth, events, resources, vendors, and reports. That structure keeps the code easier to extend and debug.

## Design Decisions and Trade-Offs

Several design decisions were made to balance implementation time, security, and long-term maintainability.

- **Next.js for the frontend and Express for the backend:** This separation keeps UI concerns and API concerns cleanly isolated. The trade-off is a little more setup and coordination than a single monolithic framework, but it gives clearer boundaries and makes each layer easier to reason about.
- **TypeScript across the stack:** Using TypeScript improves consistency and reduces integration mistakes between frontend models and backend payloads. The trade-off is slightly slower initial development because interfaces and types need to be maintained.
- **Prisma with PostgreSQL:** Prisma simplifies schema management, migrations, and database access while PostgreSQL provides a reliable relational model for structured operational data. The trade-off is less low-level query flexibility than hand-written SQL in some cases, but much better development speed and safety.
- **JWT authentication with optional 2FA:** JWT supports stateless authentication that fits well with an API-first architecture, while 2FA strengthens account security. The trade-off is added implementation and user-flow complexity, especially during onboarding and profile management.
- **Role-based access control:** RBAC fits the domain because admins, managers, staff, and viewers each need different levels of access. The trade-off is more middleware, more testing surface, and more care required when exposing routes and UI actions.
- **Simple, functional UI styling with Tailwind CSS:** Tailwind made it practical to build a consistent interface quickly with reusable utility classes and shared component styles. The trade-off is that the visual design is intentionally more utilitarian than highly customized.

## Challenges Encountered and Lessons Learned

One recurring challenge in this project was coordinating multiple concerns across the stack at the same time. Authentication, role checks, API contracts, database schema updates, and frontend pages all depend on one another, so a change in one layer often required adjustments in several others. That made clear documentation, shared types, and predictable module boundaries much more valuable than they first appeared.

Another challenge was balancing security with usability. Features like JWT authentication, 2FA, and RBAC are important, but each one adds friction to implementation and testing. The project reinforced the lesson that secure systems need to be designed into the workflow early; adding them later is more expensive and risks inconsistent behavior.

The project also highlighted the importance of building around realistic user tasks instead of isolated CRUD pages. Events, resources, vendors, and reports are more useful when they are connected by actual workflows such as allocation, usage tracking, and low-stock alerts. That pushed the design toward a more integrated system and away from a collection of unrelated forms.

The main lesson learned was that a maintainable full-stack project benefits from strong separation of concerns and iterative delivery. Keeping auth, business logic, reporting, and UI structure modular made the codebase easier to expand, while building core functionality first made it easier to add reporting, security, and polish afterward.

## Features

- ** Secure Authentication**
  - JWT-based authentication
  - Two-factor authentication (2FA) with TOTP
  - Role-based access control (RBAC)
  - Password hashing with bcrypt

- ** Resource Management**
  - Complete CRUD operations for resources
  - Inventory tracking
  - Vendor associations
  - Real-time availability monitoring

- ** Event Management**
  - Create and manage events
  - Resource allocation to events
  - Check-in/check-out tracking
  - Event-specific resource usage

- ** Vendor Management**
  - Vendor profiles and contacts
  - Resource-vendor relationships
  - Usage tracking by vendor

- ** Reporting & Analytics**
  - Resource usage by event
  - Vendor-based usage reports
  - Inventory availability
  - Usage over time analytics
  - Low stock alerts

- ** Mobile-Friendly**
  - Responsive design
  - Touch-optimized interface
  - Mobile-first approach

- ** Production-Ready**
  - HTTPS/TLS support
  - Rate limiting
  - Security headers
  - CORS protection
  - Cloud deployment ready

##  Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT + Speakeasy (2FA)
- **Security**: bcrypt, helmet, express-rate-limit

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Charts**: Recharts
- **2FA QR**: qrcode.react

##  Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

##  Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CPTS_427
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database (creates default users and sample data)
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

**Default Login Credentials:**
- **Admin**: `admin@example.com` / `Admin123!`
- **Manager**: `manager@example.com` / `Manager123!`

 **IMPORTANT**: Change these credentials in production!

##  Project Structure

```
CPTS_427/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding script
│   ├── src/
│   │   ├── auth/              # Authentication routes & controllers
│   │   ├── events/            # Events management
│   │   ├── resources/         # Resources management
│   │   ├── vendors/           # Vendors management
│   │   ├── reports/           # Reporting endpoints
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context providers
│   │   ├── services/          # API service functions
│   │   └── styles/            # Global styles
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

##  User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management |
| **EVENT_MANAGER** | Manage events, resources, vendors |
| **STAFF** | Log resource usage, view data |
| **VIEWER** | Read-only access to all data |

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/confirm` - Confirm 2FA setup
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/profile` - Get user profile

### Events Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (EVENT_MANAGER+)
- `PUT /api/events/:id` - Update event (EVENT_MANAGER+)
- `DELETE /api/events/:id` - Delete event (EVENT_MANAGER+)

### Resources Endpoints
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (EVENT_MANAGER+)
- `PUT /api/resources/:id` - Update resource (EVENT_MANAGER+)
- `DELETE /api/resources/:id` - Delete resource (EVENT_MANAGER+)
- `GET /api/resources/:id/usage` - Get usage logs
- `POST /api/resources/:id/usage` - Log usage (STAFF+)

### Vendors Endpoints
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor (EVENT_MANAGER+)
- `PUT /api/vendors/:id` - Update vendor (EVENT_MANAGER+)
- `DELETE /api/vendors/:id` - Delete vendor (EVENT_MANAGER+)

### Reports Endpoints
- `GET /api/reports/events/:eventId/usage` - Resource usage by event
- `GET /api/reports/vendors/usage` - Vendor-based usage
- `GET /api/reports/inventory/availability` - Inventory availability
- `GET /api/reports/usage/timeline` - Usage over time
- `GET /api/reports/alerts/low-stock` - Low stock alerts

##  Security Features

-  HTTPS/TLS enforcement
-  JWT authentication
-  TOTP-based 2FA
-  Password hashing (bcrypt)
-  Rate limiting on auth endpoints
-  Helmet security headers
-  CORS protection
-  Input validation
-  SQL injection protection (Prisma)
-  XSS protection

##  Development

### Backend Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

### Frontend Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

##  Production Deployment

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=https://your-frontend-url.com
APP_NAME=Event Resource Management
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Deployment Platforms

#### Backend
- **Render**: PostgreSQL + Node.js service
- **Railway**: Full-stack deployment
- **Heroku**: With Postgres add-on
- **AWS**: EC2 + RDS
- **Azure**: App Service + Database

#### Frontend
- **Vercel**: Recommended for Next.js
- **Netlify**: Full frontend deployment
- **AWS Amplify**
- **Azure Static Web Apps**

### Database Setup (Production)

1. Create PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Run migrations: `npm run prisma:migrate`
4. Optionally seed: `npx tsx prisma/seed.ts`

##  Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```
---
