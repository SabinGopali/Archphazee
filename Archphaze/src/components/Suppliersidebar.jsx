import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Suppliersidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const menuItems = [
    { name: 'Dashboard', path: '/supplier/dashboard', icon: '📊' },
    { name: 'Store Profile', path: '/supplier/store-profile', icon: '🏪' },
    { name: 'Products', path: '/supplier/products', icon: '📦' },
    { name: 'Orders', path: '/supplier/orders', icon: '📋' },
    { name: 'Analytics', path: '/supplier/analytics', icon: '📈' },
    { name: 'Settings', path: '/supplier/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Supplier Portal</h2>
        <p className="text-sm text-gray-500">{currentUser?.email}</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}