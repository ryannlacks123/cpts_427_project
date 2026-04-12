'use client';

import { useAuth } from '@/context/AuthContext';
import { getEvents } from '@/services/events.service';
import { getLowStockAlerts } from '@/services/reports.service';
import { getResources } from '@/services/resources.service';
import { getVendors } from '@/services/vendors.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    resources: 0,
    vendors: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [eventsData, resourcesData, vendorsData, lowStockData] = await Promise.all([
          getEvents(),
          getResources(),
          getVendors(),
          getLowStockAlerts(0.2),
        ]);

        setStats({
          events: eventsData.length,
          resources: resourcesData.length,
          vendors: vendorsData.length,
          lowStock: lowStockData.total || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Events',
      value: stats.events,
      link: '/events',
      color: 'bg-blue-500',
      icon: '📅',
    },
    {
      title: 'Total Resources',
      value: stats.resources,
      link: '/resources',
      color: 'bg-green-500',
      icon: '📦',
    },
    {
      title: 'Total Vendors',
      value: stats.vendors,
      link: '/vendors',
      color: 'bg-purple-500',
      icon: '🏢',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      link: '/reports',
      color: 'bg-orange-500',
      icon: '⚠️',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <div className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/events" className="block">
              <button className="btn btn-primary w-full">View Events</button>
            </Link>
            <Link href="/resources" className="block">
              <button className="btn btn-secondary w-full">Manage Resources</button>
            </Link>
            <Link href="/reports" className="block">
              <button className="btn btn-secondary w-full">View Reports</button>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Your Role:</span>
              <span className="font-medium text-gray-900">{user?.roles.join(', ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">2FA Enabled:</span>
              <span className={`font-medium ${user?.is2faEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {user?.is2faEnabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
