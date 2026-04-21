# Event Resource Management System

A comprehensive, secure, cloud-ready web application for managing event resources, equipment, supplies, and vendor materials with mobile-first design.

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
