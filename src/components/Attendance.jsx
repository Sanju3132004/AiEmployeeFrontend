import { useEffect, useState } from 'react';
import { checkIn, checkOut, getMyAttendance } from '../services/employeeService';

function Attendance() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRecords = () => {
    getMyAttendance()
      .then((res) => setRecords(res.data))
      .catch(() => setError('Could not load attendance history.'));
  };

  useEffect(() => { loadRecords(); }, []);

  const handleCheckIn = async () => {
    setError(''); setMessage('');
    try {
      await checkIn();
      setMessage('Checked in successfully.');
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed.');
    }
  };

  const handleCheckOut = async () => {
    setError(''); setMessage('');
    try {
      await checkOut();
      setMessage('Checked out successfully.');
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed.');
    }
  };

  return (
    <div className="page">
      <h2>Attendance</h2>
      {error && <div className="alert-error">{error}</div>}
      {message && <div className="alert-success">{message}</div>}

      <div className="card">
        <button className="btn btn-primary" onClick={handleCheckIn}>Check In</button>
        <button className="btn btn-secondary" onClick={handleCheckOut}>Check Out</button>
      </div>

      <h3>My Attendance History</h3>
      {records.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.checkIn || '-'}</td>
                <td>{r.checkOut || '-'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Attendance;
