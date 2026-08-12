import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
