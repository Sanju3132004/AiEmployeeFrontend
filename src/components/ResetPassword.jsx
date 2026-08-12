import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

function ResetPassword() {
  const [form, setForm] = useState({ token: '', newPassword: '' });
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
      await resetPassword(form.token.trim(), form.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. Check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p className="auth-hint">Enter the reset code emailed to you, plus your new password.</p>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">Password reset! Redirecting to login...</div>}
        <label>Reset Code</label>
        <input name="token" value={form.token} onChange={handleChange} required placeholder="e.g. A1B2C3D4" />
        <label>New Password</label>
        <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <p className="auth-switch">
          <Link to="/forgot-password">Didn't get a code? Request again</Link> &middot; <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
