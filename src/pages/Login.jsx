import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { isValidEmail } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setMessage('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    const result = await loginUser(form.email, form.password);
    setSubmitting(false);
    if (!result.success) {
      setMessage(result.message || 'Invalid email or password.');
      return;
    }
    login(result.data.user);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">SmartPet</span>
        </Link>
        <h1>Welcome back</h1>
        <p className="auth-sub">Login to manage your pet health records.</p>

        {message && <div className="alert alert-error">{message}</div>}

        <form onSubmit={onSubmit} noValidate>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
            error={errors.email}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter password"
            required
            error={errors.password}
          />
          <Button type="submit" className="btn-block" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="demo-hint">
          Demo: <code>demo@smartpet.com</code> / <code>demo123</code> (run backend seed)
        </p>
      </div>
    </div>
  );
}
