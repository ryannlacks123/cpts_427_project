'use client';

import { useEffect, useState } from 'react';
import { getVendors, Vendor } from '@/services/vendors.service';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : vendors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No vendors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{vendor.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Contact: {vendor.contactName}</p>
                <p>Email: {vendor.contactEmail}</p>
                <p>Phone: {vendor.phone}</p>
              </div>
              {vendor.resources && (
                <p className="mt-3 text-xs text-gray-500">
                  {vendor.resources.length} resource(s)
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
