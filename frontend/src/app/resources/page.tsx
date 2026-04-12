'use client';

import { useEffect, useState } from 'react';
import { getResources, Resource } from '@/services/resources.service';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No resources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {resource.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Quantity: {resource.totalQuantity}</span>
                {resource.vendor && (
                  <span className="text-xs text-gray-500">{resource.vendor.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
