import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdminOrManager } from '../services/authService';

function AdminRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isAdminOrManager()) return <Navigate to="/dashboard" replace />;
  return children;
}

export default AdminRoute;
