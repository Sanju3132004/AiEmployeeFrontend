import { useEffect, useState } from 'react';
import { applyLeave, getMyLeaves } from '../services/employeeService';

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ startDate: '', endDate: '', leaveType: 'CASUAL', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadLeaves = () => {
    getMyLeaves()
      .then((res) => setLeaves(res.data))
      .catch(() => setError('Could not load leave history.'));
  };

  useEffect(() => { loadLeaves(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await applyLeave(form);
      setMessage('Leave applied successfully.');
      setForm({ startDate: '', endDate: '', leaveType: 'CASUAL', reason: '' });
      loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply leave.');
    }
  };

  return (
    <div className="page">
      <h2>Leave Management</h2>

      <form className="card form-card" onSubmit={handleSubmit}>
        <h3>Apply for Leave</h3>
        {error && <div className="alert-error">{error}</div>}
        {message && <div className="alert-success">{message}</div>}
        <div className="form-row">
          <div>
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>
        </div>
        <label>Leave Type</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange}>
          <option value="CASUAL">Casual</option>
          <option value="SICK">Sick</option>
          <option value="EARNED">Earned</option>
          <option value="UNPAID">Unpaid</option>
        </select>
        <label>Reason</label>
        <textarea name="reason" value={form.reason} onChange={handleChange} required />
        <button className="btn btn-primary" type="submit">Apply Leave</button>
      </form>

      <h3>My Leave History</h3>
      {leaves.length === 0 ? (
        <p>No leave requests yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Start</th><th>End</th><th>Type</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.startDate}</td>
                <td>{l.endDate}</td>
                <td>{l.leaveType}</td>
                <td>{l.reason}</td>
                <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaves;
