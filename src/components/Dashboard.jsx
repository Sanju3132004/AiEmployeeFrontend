import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';

function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then((res) => setEmployee(res.data))
      .catch(() => setError('Could not load profile.'));
  }, []);

  return (
    <div className="page">
      <h2>Dashboard</h2>
      {error && <div className="alert-error">{error}</div>}
      {employee ? (
        <div className="card">
          <p><strong>Name:</strong> {employee.fullName}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Department:</strong> {employee.department || '-'}</p>
          <p><strong>Designation:</strong> {employee.designation || '-'}</p>
          <p><strong>Role:</strong> {employee.role}</p>
          <p><strong>Date of Joining:</strong> {employee.dateOfJoining || '-'}</p>
        </div>
      ) : (
        !error && <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Dashboard;
