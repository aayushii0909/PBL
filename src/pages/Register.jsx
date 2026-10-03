import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { isValidEmail, isValidPhone } from '../utils/helpers';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setMessage('');
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.';
    if (!form.phone.trim()) next.phone = 'Phone is required.';
    else if (!isValidPhone(form.phone)) next.phone = 'Enter a valid 10-digit phone number.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password.';
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
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
    const result = await registerUser({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setSubmitting(false);

    if (!result.success) {
      setMessage(result.message || 'Registration failed.');
      return;
    }
    setSuccess(true);
    setMessage(result.message || 'Registration successful! Please login.');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">SmartPet</span>
        </Link>
        <h1>Create account</h1>
        <p className="auth-sub">Register to start managing pet health records.</p>

        {message && (
          <div className={`alert ${success ? 'alert-success' : 'alert-error'}`}>{message}</div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <FormInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Your full name"
            required
            error={errors.fullName}
          />
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
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="10-digit mobile number"
            required
            error={errors.phone}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 6 characters"
            required
            error={errors.password}
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Re-enter password"
            required
            error={errors.confirmPassword}
          />
          <Button type="submit" className="btn-block" disabled={success || submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
