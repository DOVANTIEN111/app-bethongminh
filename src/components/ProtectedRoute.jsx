// src/components/ProtectedRoute.jsx
// Component bảo vệ routes theo vai trò
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRBAC, ROLES } from '../contexts/RBACContext';
import { Loader2 } from 'lucide-react';

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <p className="text-lg">Đang tải...</p>
      </div>
    </div>
  );
}

// Redirect paths based on role
const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.TEACHER]: '/teacher',
  [ROLES.PARENT]: '/parent',
  [ROLES.STUDENT]: '/',
};

export function ProtectedRoute({
  children,
  allowedRoles = [], // Các vai trò được phép truy cập
  redirectTo = '/login', // Redirect nếu chưa đăng nhập
}) {
  const { isAuthenticated, loading, role } = useRBAC();
  const location = useLocation();

  // Đang loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Chưa đăng nhập -> redirect đến login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng không có quyền
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect đến dashboard tương ứng với role
    const defaultPath = ROLE_DASHBOARDS[role] || '/';
    return <Navigate to={defaultPath} replace />;
  }

  return children;
}

// HOC để bảo vệ route
export function withRoleProtection(WrappedComponent, allowedRoles = []) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

// Component redirect đến dashboard theo role sau khi login
export function RoleBasedRedirect() {
  const { isAuthenticated, loading, role } = useRBAC();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có state.from (từ ProtectedRoute), redirect về đó
  const from = location.state?.from?.pathname;
  if (from && from !== '/login') {
    return <Navigate to={from} replace />;
  }

  // Redirect đến dashboard theo role
  const dashboardPath = ROLE_DASHBOARDS[role] || '/';
  return <Navigate to={dashboardPath} replace />;
}

export default ProtectedRoute;
