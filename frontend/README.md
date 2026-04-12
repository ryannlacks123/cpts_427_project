# Event Resource Management System - Frontend

A modern, responsive React frontend built with Next.js for the Event Resource Management System.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Date Formatting**: date-fns
- **Charts**: Recharts
- **2FA QR Codes**: qrcode.react

## Features

- 🔐 Secure authentication with JWT
- 🔑 2FA setup and verification
- 👥 Role-based UI restrictions
- 📱 Mobile-first responsive design
- 🎨 Clean, modern UI with Tailwind CSS
- ⚡ Fast page loads with Next.js
- 🔄 Automatic token refresh
- 📊 Interactive charts and reports

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page & layout
│   ├── events/             # Events management
│   ├── resources/          # Resources management
│   ├── vendors/            # Vendors management
│   ├── reports/            # Reports & analytics
│   ├── profile/            # User profile
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home/redirect page
├── components/             # Reusable components
│   ├── Navigation.tsx      # Main navigation
│   └── ProtectedRoute.tsx  # Auth guard
├── context/                # React Context
│   └── AuthContext.tsx     # Authentication state
├── services/               # API services
│   ├── api.ts              # Axios instance
│   ├── auth.service.ts     # Auth API calls
│   ├── events.service.ts   # Events API calls
│   ├── resources.service.ts # Resources API calls
│   ├── vendors.service.ts  # Vendors API calls
│   └── reports.service.ts  # Reports API calls
└── styles/                 # Global styles
    └── globals.css         # Tailwind & custom styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running backend server

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages & Routes

### Public Routes
- `/` - Home (redirects to dashboard or login)
- `/login` - Login page with 2FA support
- `/register` - User registration

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard with stats
- `/events` - Events list and management
- `/resources` - Resources inventory
- `/vendors` - Vendor management
- `/reports` - Analytics and reports
- `/profile` - User profile and settings

## Components

### ProtectedRoute
Wraps protected pages to ensure user is authenticated. Redirects to login if not authenticated.

### Navigation
Main navigation bar with role-based menu items and user info.

### AuthContext
Provides authentication state and functions throughout the app:
- `user` - Current user object
- `login()` - Save auth data
- `logout()` - Clear auth and redirect
- `isAuthenticated` - Boolean auth status
- `hasRole()` - Check user roles

## Services

### API Service
Base Axios instance with:
- Request interceptor for auth tokens
- Response interceptor for error handling
- Automatic token injection
- Centralized error handling

### Auth Service
Functions:
- `register()` - Create new account
- `login()` - Authenticate user
- `verify2FA()` - Verify 2FA code
- `enable2FA()` - Enable 2FA
- `confirm2FA()` - Confirm 2FA setup
- `disable2FA()` - Disable 2FA
- `getProfile()` - Get user details
- `logout()` - Clear session

### Events Service
- CRUD operations for events
- Resource allocation
- Event-resource management

### Resources Service
- CRUD operations for resources
- Usage logging
- Usage history

### Vendors Service
- CRUD operations for vendors
- Vendor details and contacts

### Reports Service
- Inventory availability
- Low stock alerts
- Usage analytics
- Vendor reports
- Timeline reports

## Styling

### Tailwind Classes

Custom utility classes:
- `.btn` - Base button
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger/delete button
- `.input` - Form input
- `.card` - Card container
- `.label` - Form label

### Color Scheme

Primary colors (blue):
- `primary-50` to `primary-900`

Usage:
```jsx
<button className="btn btn-primary">Click me</button>
<div className="card">Content</div>
<input className="input" />
```

## State Management

### AuthContext

Manages authentication state globally:

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, hasRole, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  if (hasRole('ADMIN')) {
    return <AdminPanel />;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

## Form Handling

Using React Hook Form:

```tsx
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    // Handle form submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Required</span>}
    </form>
  );
}
```

## API Integration

Example API call:

```tsx
import { getEvents } from '@/services/events.service';

function EventsList() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    loadEvents();
  }, []);
  
  return <div>{/* Render events */}</div>;
}
```

## Role-Based UI

```tsx
import { useAuth } from '@/context/AuthContext';

function AdminButton() {
  const { hasRole } = useAuth();
  
  if (!hasRole(['ADMIN', 'EVENT_MANAGER'])) {
    return null;
  }
  
  return <button>Admin Action</button>;
}
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001/api)

## Mobile Responsiveness

The app uses Tailwind's responsive classes:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Production Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

The build will be optimized and ready for deployment.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables
4. Deploy

### Docker

Create `Dockerfile` in frontend directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t erm-frontend .
docker run -p 3000:3000 erm-frontend
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators

## License

ISC
