'use client';

import { getVendor, getVendors, Vendor } from '@/services/vendors.service';
import { useEffect, useState } from 'react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

  const openVendorModal = async (vendorId: string) => {
    setModalLoading(true);
    setModalError(null);

    try {
      const vendor = await getVendor(vendorId);
      setSelectedVendor(vendor);
    } catch (error) {
      console.error('Error loading vendor details:', error);
      setModalError('Failed to load vendor details');
    } finally {
      setModalLoading(false);
    }
  };

  const closeVendorModal = () => {
    setSelectedVendor(null);
    setModalError(null);
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
            <button
              key={vendor.id}
              type="button"
              className="card text-left hover:shadow-lg transition-shadow"
              onClick={() => void openVendorModal(vendor.id)}
            >
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
            </button>
          ))}
        </div>
      )}

      {(selectedVendor || modalLoading || modalError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedVendor?.name ?? 'Vendor Details'}
                </h2>
                {selectedVendor && (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Contact: {selectedVendor.contactName}</p>
                    <p>Email: {selectedVendor.contactEmail}</p>
                    <p>Phone: {selectedVendor.phone}</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                onClick={closeVendorModal}
              >
                Close
              </button>
            </div>

            {modalLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading vendor details...</div>
            ) : modalError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {modalError}
              </div>
            ) : selectedVendor?.resources && selectedVendor.resources.length > 0 ? (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Owned Resources
                </h3>
                <div className="space-y-3">
                  {selectedVendor.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                        <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                          {resource.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Quantity owned: {resource.totalQuantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                This vendor does not have any resources yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
