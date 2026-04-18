import { Outlet, Navigate } from 'react-router-dom';

function PublicLayout() {
  const token = localStorage.getItem('accessToken');
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
