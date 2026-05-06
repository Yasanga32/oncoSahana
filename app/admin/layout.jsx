import AdminSidebar from '../../components/layout/AdminSidebar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-grow p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
