import { useEffect, useState } from 'react';
import { getMyPayslips, generatePayslip, listAllEmployees } from '../services/employeeService';
import { isAdminOrManager } from '../services/authService';

function Payroll() {
  const canManage = isAdminOrManager();

  const [payslips, setPayslips] = useState([]);
  const [error, setError] = useState('');

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: '', month: '', basicSalary: '', allowances: '', deductions: ''
  });
  const [genMessage, setGenMessage] = useState('');
  const [genError, setGenError] = useState('');

  useEffect(() => {
    getMyPayslips()
      .then((res) => setPayslips(res.data))
      .catch(() => setError('Could not load payslips.'));

    if (canManage) {
      listAllEmployees()
        .then((res) => setEmployees(res.data))
        .catch(() => {});
    }
  }, [canManage]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenError('');
    setGenMessage('');
    try {
      await generatePayslip({
        employee: { id: Number(form.employeeId) },
        month: form.month,
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
      });
      setGenMessage('Payslip generated successfully.');
      setForm({ employeeId: '', month: '', basicSalary: '', allowances: '', deductions: '' });
    } catch (err) {
      setGenError(err.response?.data?.message || 'Could not generate payslip.');
    }
  };

  return (
    <div className="page">
      <h2>Payroll</h2>

      {canManage && (
        <form className="card form-card" onSubmit={handleGenerate}>
          <h3>Generate Payslip</h3>
          {genError && <div className="alert-error">{genError}</div>}
          {genMessage && <div className="alert-success">{genMessage}</div>}
          <label>Employee</label>
          <select name="employeeId" value={form.employeeId} onChange={handleChange} required>
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
            ))}
          </select>
          <label>Month (e.g. 2026-08)</label>
          <input name="month" placeholder="YYYY-MM" value={form.month} onChange={handleChange} required />
          <div className="form-row">
            <div>
              <label>Basic Salary</label>
              <input name="basicSalary" type="number" value={form.basicSalary} onChange={handleChange} required />
            </div>
            <div>
              <label>Allowances</label>
              <input name="allowances" type="number" value={form.allowances} onChange={handleChange} />
            </div>
            <div>
              <label>Deductions</label>
              <input name="deductions" type="number" value={form.deductions} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>Generate Payslip</button>
        </form>
      )}

      <h3>{canManage ? 'My Payslips' : 'My Payslips'}</h3>
      {error && <div className="alert-error">{error}</div>}
      {payslips.length === 0 ? (
        <p>No payslips generated yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Month</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th></tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p.id}>
                <td>{p.month}</td>
                <td>{p.basicSalary}</td>
                <td>{p.allowances}</td>
                <td>{p.deductions}</td>
                <td>{p.netSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Payroll;
