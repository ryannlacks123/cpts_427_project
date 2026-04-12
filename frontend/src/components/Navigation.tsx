'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
    { href: '/events', label: 'Events', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
    { href: '/resources', label: 'Resources', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
    { href: '/vendors', label: 'Vendors', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
    { href: '/reports', label: 'Reports', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
    { href: '/profile', label: 'Profile', roles: ['VIEWER', 'STAFF', 'EVENT_MANAGER', 'ADMIN'] },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary-600">ERM System</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navLinks.map((link) =>
                hasRole(link.roles) ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.roles.join(', ')}</p>
            </div>
            <button onClick={logout} className="btn btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3">
          <div className="space-y-1">
            {navLinks.map((link) =>
              hasRole(link.roles) ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
