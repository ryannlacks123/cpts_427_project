'use client';

import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="label">Name</label>
            <p className="text-lg text-gray-900">{user?.name}</p>
          </div>

          <div>
            <label className="label">Email</label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="label">Roles</label>
            <div className="flex gap-2 mt-2">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Two-Factor Authentication</label>
            <p className={`text-lg ${user?.is2faEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {user?.is2faEnabled ? 'Enabled ✓' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
