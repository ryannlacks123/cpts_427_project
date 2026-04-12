# COPILOT PROJECT HANDBOOK  
### Secure Event Resource Management System  
### Developer Handoff for GitHub Copilot (VS Code)

This document defines the architecture, data model, coding conventions, and feature requirements for the Secure Event Resource Management System. GitHub Copilot should use this document as the authoritative reference when generating code.

---

# 1. Project Overview

Build a secure, mobile‑friendly, cloud‑hosted web application for managing event resources (equipment, supplies, vendor materials).  
The system must support:

- Secure access over Wi‑Fi (TLS‑only)
- Accounts‑based authentication
- Role‑based access control (RBAC)
- Two‑factor authentication (2FA)
- Resource & inventory management
- Event & vendor management
- Usage logging and reporting
- Cloud deployment readiness

The application must be optimized for mobile devices (phones/tablets).

---

# 2. Technology Stack

Copilot should generate code using the following stack unless explicitly instructed otherwise:

## Backend
- Node.js  
- Express.js  
- Prisma ORM  
- PostgreSQL  
- JSON Web Tokens (JWT) or secure session cookies  
- TOTP‑based 2FA (e.g., `speakeasy`)  
- bcrypt or argon2 for password hashing  

## Frontend
- React or Next.js  
- Tailwind CSS or Material UI  
- React Router (if not using Next.js)  
- Axios or Fetch for API calls  

## Infrastructure
- Cloud deployment (Render, Railway, Azure, AWS, etc.)  
- HTTPS/TLS enforced  
- Environment variables for secrets  

---

# 3. Data Model (Authoritative)

Copilot should generate models, migrations, and API endpoints based on the following schema.

## Users
id (UUID) email (string, unique) password_hash (string) name (string) is_2fa_enabled (boolean) twofa_secret (string, encrypted, nullable) created_at (timestamp) updated_at (timestamp)

## Roles
id (UUID) name (string: ADMIN, EVENT_MANAGER, STAFF, VIEWER)

## UserRoles
user_id (UUID, FK → users) role_id (UUID, FK → roles) PRIMARY KEY (user_id, role_id)

## Events
id (UUID) name (string) location (string) start_datetime (timestamp) end_datetime (timestamp) description (text) created_by (UUID, FK → users)

## Vendors
id (UUID) name (string) contact_name (string) contact_email (string) phone (string)

## Resources
id (UUID) name (string) category (string) description (text) vendor_id (UUID, FK → vendors, nullable) total_quantity (int) created_at (timestamp)

## EventResources
id (UUID) event_id (UUID, FK → events) resource_id (UUID, FK → resources) allocated_quantity (int)

## ResourceUsageLogs
id (UUID) event_id (UUID) resource_id (UUID) user_id (UUID) change (int) // negative = checkout, positive = return timestamp (timestamp) notes (text)

## AuditLogs (Not required but recommended)
id (UUID) user_id (UUID) action (string) entity_type (string) entity_id (UUID) timestamp (timestamp) metadata (JSON)


---

# 4. Backend Requirements

Copilot should generate:

## Authentication
- Email + password login  
- Password hashing (bcrypt or argon2)  
- JWT or secure session cookies  
- 2FA using TOTP  
- Middleware for:
  - Authentication
  - Role-based authorization
  - Input validation

## API Structure
Use RESTful conventions:
/auth/login /auth/2fa/verify /auth/register /events /vendors /resources /events/:id/resources /resources/:id/usage /reports/...


## Security Requirements
- HTTPS only  
- No sensitive data in URLs  
- Validate all input  
- Rate limit login endpoints  
- Use secure cookies if sessions are used  

---

# 5. Frontend Requirements

Copilot should generate:

## UI Features
- Mobile‑first responsive layout  
- Login + 2FA screens  
- Dashboard  
- CRUD pages for:
  - Events
  - Vendors
  - Resources
- Resource allocation UI  
- Check‑in / check‑out UI  
- Reporting pages (tables + charts)

## State Management
- Local state or lightweight global state (Context API)  
- Store JWT/session securely (no localStorage for sensitive tokens)  

## Routing
- Public routes: login, 2FA  
- Protected routes: everything else  
- Role‑based UI restrictions  

---

# 6. Reporting Requirements

Copilot should generate endpoints and UI for:

- Resource usage by event  
- Vendor‑based resource usage  
- Inventory availability  
- Usage over time  
- Low‑stock alerts  

Charts may use Chart.js or Recharts.

---

# 7. Coding Conventions

Copilot should follow:

## Backend
- Use TypeScript if possible  
- Use async/await  
- Use Express routers  
- Use Prisma schema for DB  
- Use environment variables for secrets  

## Frontend
- Functional components  
- React hooks  
- Tailwind or MUI  
- Clean separation of components, hooks, and services  

---

# 8. Project Structure (Recommended)

## Backend
/src /auth /events /resources /vendors /reports /middleware /utils app.ts server.ts prisma/schema.prisma

# Frontend
/src /components /pages or /routes /hooks /services /styles


---

# 9. Development Roadmap (for Copilot)

Copilot should generate code in this order:

1. Initialize backend + Prisma + PostgreSQL  
2. Implement user model + auth + 2FA  
3. Implement RBAC middleware  
4. Implement CRUD for events, vendors, resources  
5. Implement event‑resource allocation  
6. Implement usage logging  
7. Implement reporting endpoints  
8. Build frontend pages for each feature  
9. Add mobile‑friendly UI  
10. Prepare deployment configuration  

---

# 10. Copilot Behavior Expectations

Copilot should:

- Follow this document as the source of truth  
- Generate modular, maintainable code  
- Use the defined data model  
- Use secure coding practices  
- Prefer TypeScript when possible  
- Avoid generating placeholder logic unless necessary  
- Generate comments and docstrings for clarity  

---
