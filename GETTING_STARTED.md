# Getting Started Guide

This guide will walk you through setting up and running the Event Resource Management System from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

Verify installations:
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
psql --version  # Should be 14+
```

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. Start PostgreSQL service (varies by OS)
   - Windows: PostgreSQL should start automatically
   - Mac: `brew services start postgresql@14`
   - Linux: `sudo systemctl start postgresql`

2. Create database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (in psql prompt)
CREATE DATABASE event_resource_mgmt;

# Create user (optional)
CREATE USER erm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE event_resource_mgmt TO erm_user;

# Exit psql
\q
```

### Option B: Cloud Database (Render, Supabase, etc.)

1. Sign up for a PostgreSQL hosting service
2. Create a new PostgreSQL database
3. Copy the connection string (DATABASE_URL)

## Step 2: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
# Copy example file
cp .env.example .env
```

4. **Edit .env file:**

Open `.env` and update with your database credentials:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/event_resource_mgmt?schema=public"

# OR for cloud database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Other settings
PORT=3001
NODE_ENV=development
JWT_SECRET=change-this-to-a-random-secret-key-12345
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:3000
APP_NAME="Event Resource Management"
```

5. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

6. **Run database migrations:**
```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

7. **Seed the database:**
```bash
npm run seed
```

This creates:
- Default roles (ADMIN, EVENT_MANAGER, STAFF, VIEWER)
- Admin user: `admin@example.com` / `Admin123!`
- Manager user: `manager@example.com` / `Manager123!`
- Sample vendors and resources

8. **Start the backend server:**
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 3001
📍 Environment: development
🔗 API available at: http://localhost:3001/api
💚 Health check: http://localhost:3001/api/health
```

## Step 3: Frontend Setup

Open a **new terminal window** and:

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
# The file is already created, but you can verify it exists
# frontend/.env.local should contain:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Start the frontend development server:**
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

## Step 4: Access the Application

1. **Open your browser** and navigate to: `http://localhost:3000`

2. **Login with default credentials:**
   - **Admin Account:**
     - Email: `admin@example.com`
     - Password: `Admin123!`
   
   - **Manager Account:**
     - Email: `manager@example.com`
     - Password: `Manager123!`

3. **Explore the application:**
   - Dashboard - View statistics
   - Events - Manage events
   - Resources - View and manage resources
   - Vendors - View vendor information
   - Reports - View inventory and usage reports
   - Profile - View your profile

## Step 5: Test Key Features

### Create a New Event
1. Navigate to Events
2. Click "Create Event" (if you have EVENT_MANAGER or ADMIN role)
3. Fill in event details
4. Save

### View Resources
1. Navigate to Resources
2. Browse available equipment and supplies
3. View resource details and quantities

### Check Reports
1. Navigate to Reports
2. View inventory availability
3. Check low stock alerts

### Enable 2FA (Optional)
1. Go to Profile
2. Enable Two-Factor Authentication
3. Scan QR code with authenticator app
4. Verify with code

## Troubleshooting

### Backend won't start

**Issue:** Database connection error
```
Error: Can't reach database server
```

**Solution:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists
- Verify credentials

---

**Issue:** Port 3001 already in use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
- Stop other process using port 3001
- OR change PORT in `.env` to another port (e.g., 3002)

---

**Issue:** Prisma client not generated
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run prisma:generate
```

### Frontend won't start

**Issue:** Port 3000 already in use

**Solution:**
Stop the other process or Next.js will prompt to use port 3001

---

**Issue:** API connection errors

**Solution:**
- Verify backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Check browser console for CORS errors

### General Issues

**Clear and reinstall:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

**Reset database:**
```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
npm run seed
```

## Development Workflow

### Making Changes

1. **Backend changes (API, database):**
   - Edit files in `backend/src/`
   - Server auto-restarts with tsx watch
   - For database changes, create new migration:
     ```bash
     cd backend
     npm run prisma:migrate
     ```

2. **Frontend changes (UI):**
   - Edit files in `frontend/src/`
   - Browser auto-refreshes
   - Changes appear immediately

### Viewing Database

Use Prisma Studio to view/edit data:
```bash
cd backend
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Next Steps

Now that your application is running:

1. **Explore the codebase:**
   - Backend: `backend/src/` - API routes and controllers
   - Frontend: `frontend/src/app/` - Pages and components

2. **Customize:**
   - Add new features
   - Modify styling
   - Add more roles or permissions

3. **Deploy to production** (when ready):
   - See main README.md for deployment instructions

## Getting Help

- Check `README.md` for detailed documentation
- Review code comments in source files
- Check browser console for frontend errors
- Check terminal for backend errors

## Common Commands Reference

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run seed             # Seed database
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter
```

---

🎉 **Congratulations!** Your Event Resource Management System is now running!
