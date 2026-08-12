import { Link, useNavigate } from 'react-router-dom';
import { logoutUser, isLoggedIn, isAdminOrManager } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">AI Employee Support Assistant</div>
      {isLoggedIn() && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leaves">Leaves</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/payroll">Payroll</Link>
          <Link to="/chatbot">AI Chatbot</Link>
          {isAdminOrManager() && <Link to="/add-employee">Add Employee</Link>}
          <span className="navbar-user">{user?.email} <span className="role-badge">{user?.role}</span></span>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
