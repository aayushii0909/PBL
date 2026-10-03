import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../utils/auth';
import { isValidEmail, isValidPhone } from '../utils/helpers';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Profile() {
  const { user, updateSession, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setMessage('');
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.';
    if (!form.phone.trim()) next.phone = 'Phone is required.';
    else if (!isValidPhone(form.phone)) next.phone = 'Enter a valid 10-digit phone.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage('Please fill all required fields.');
      return;
    }
    const result = updateUserProfile({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    });
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    updateSession(result.user);
    setMessage('Profile updated successfully.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-stack narrow">
      <div className="page-toolbar">
        <div>
          <h2>Profile & Settings</h2>
          <p>Update your account details.</p>
        </div>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes('success') || message.includes('updated') ? 'alert-success' : 'alert-error'
          }`}
        >
          {message}
        </div>
      )}

      <Card title="Account Information">
        <form className="form-grid single" onSubmit={onSave} noValidate>
          <FormInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
            error={errors.fullName}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            error={errors.email}
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            required
            error={errors.phone}
          />
          <div className="form-actions">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
