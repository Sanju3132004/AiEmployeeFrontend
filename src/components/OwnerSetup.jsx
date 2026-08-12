import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerOwner } from '../services/authService';

/**
 * One-time page to create the very first owner (ADMIN) account.
 * Requires the app.owner-setup-key value configured on the backend.
 * After the first ADMIN account exists, the backend disables this endpoint.
 */
function OwnerSetup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', setupKey: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerOwner(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create owner account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Owner Setup</h2>
        <p className="auth-hint">
          This creates the first Admin (owner) account for this company. Only needed once.
        </p>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">Owner account created! Redirecting to login...</div>}
        <label>Full Name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
        <label>Setup Key</label>
        <input name="setupKey" value={form.setupKey} onChange={handleChange} required
               placeholder="From the backend's application.properties" />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Owner Account'}
        </button>
        <p className="auth-switch">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

export default OwnerSetup;
