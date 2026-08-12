import { useState } from 'react';
import { registerUser, getRole } from '../services/authService';

/**
 * "Add Employee" page - only reachable by ADMIN / PROJECT_MANAGER (see AdminRoute).
 * The owner (ADMIN) can also assign the PROJECT_MANAGER role to a new account.
 */
function Register() {
  const isAdmin = getRole() === 'ADMIN';

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', department: '', designation: '', role: 'EMPLOYEE'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess(true);
      setForm({ fullName: '', email: '', password: '', department: '', designation: '', role: 'EMPLOYEE' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Add Employee</h2>
      <form className="card form-card" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">Account created successfully.</div>}
        <label>Full Name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Temporary Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
        <label>Department</label>
        <input name="department" value={form.department} onChange={handleChange} />
        <label>Designation</label>
        <input name="designation" value={form.designation} onChange={handleChange} />
        {isAdmin && (
          <>
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="EMPLOYEE">Employee</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="HR">HR</option>
            </select>
          </>
        )}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default Register;
