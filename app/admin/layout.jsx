'use client';

import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="bg-secondary/10 min-h-screen">
        <div className="container-custom py-8">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-8 flex items-center justify-between">
            <span className="font-bold text-primary">Admin Control Panel</span>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Authorized Personnel Only</span>
          </div>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
