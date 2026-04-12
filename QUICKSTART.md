# Quick Start - Run the Application

Follow these steps to get the Event Resource Management System running quickly.

## Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 14+ installed and running
- ✅ npm installed (`npm --version`)

## 5-Minute Setup

### 1. Setup Database (2 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (in psql prompt)
CREATE DATABASE event_resource_mgmt;

# Exit
\q
```

### 2. Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Install and setup
npm install
cp .env.example .env

# Update .env if needed (DATABASE_URL)
# Default: postgresql://postgres:postgres@localhost:5432/event_resource_mgmt

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Start backend
npm run dev
```

✅ Backend running at http://localhost:3001

### 3. Setup Frontend (1 minute)

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install and start
npm install
npm run dev
```

✅ Frontend running at http://localhost:3000

## Login

Open http://localhost:3000 and login:

- **Email**: admin@example.com
- **Password**: Admin123!

## You're Done! 🎉

Start exploring:
- View Dashboard
- Browse Events, Resources, Vendors
- Check Reports
- Update your Profile

## Need Help?

See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed instructions and troubleshooting.

## Quick Commands

### Backend (in `backend/` directory)
```bash
npm run dev              # Start dev server
npm run seed             # Reset and seed database
npm run prisma:studio    # View database GUI
```

### Frontend (in `frontend/` directory)
```bash
npm run dev    # Start dev server
```

## Stop the Application

Press `Ctrl + C` in both terminal windows to stop the servers.

---

**Happy coding!** 🚀
