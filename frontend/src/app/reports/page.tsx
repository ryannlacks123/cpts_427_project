'use client';

import { getInventoryAvailability, getLowStockAlerts } from '@/services/reports.service';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [inventory, setInventory] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [inventoryData, lowStockData] = await Promise.all([
        getInventoryAvailability(),
        getLowStockAlerts(0.2),
      ]);
      setInventory(inventoryData);
      setLowStock(lowStockData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          {inventory && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Resources</p>
                  <p className="text-3xl font-bold text-blue-900">{inventory.summary.totalResources}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Low Stock Items</p>
                  <p className="text-3xl font-bold text-orange-900">{inventory.summary.lowStock}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Fully Allocated</p>
                  <p className="text-3xl font-bold text-red-900">{inventory.summary.fullyAllocated}</p>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alerts */}
          {lowStock && lowStock.alerts.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lowStock.alerts.map((alert: any) => (
                      <tr key={alert.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{alert.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{alert.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{alert.available}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{alert.totalQuantity}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : alert.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
