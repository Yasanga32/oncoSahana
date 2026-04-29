'use client';

import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function PatientLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
