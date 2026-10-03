import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPets, getVaccinations, getReminders, saveReminders } from '../utils/auth';
import { generateId } from '../utils/storage';
import { formatDate, getDueStatus } from '../utils/helpers';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';

const EMPTY = {
  title: '',
  petId: '',
  date: '',
  description: '',
};

export default function Reminders() {
  const { user } = useAuth();
  const pets = useMemo(() => getPets(user.id), [user.id]);
  const vaccinations = useMemo(() => getVaccinations(user.id), [user.id]);
  const [custom, setCustom] = useState(() => getReminders(user.id));
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const allReminders = useMemo(() => {
    const fromVaccines = vaccinations
      .filter((v) => v.nextDueDate)
      .map((v) => ({
        id: `vacrem_${v.id}`,
        title: `${v.vaccineName} vaccination`,
        petName: v.petName,
        date: v.nextDueDate,
        description: 'Auto-generated from vaccination next due date',
        type: 'vaccination',
        status: getDueStatus(v.nextDueDate),
      }));

    const fromCustom = custom.map((r) => ({
      ...r,
      status: getDueStatus(r.date),
      type: 'custom',
    }));

    return [...fromVaccines, ...fromCustom].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [vaccinations, custom]);

  const grouped = {
    Overdue: allReminders.filter((r) => r.status === 'Overdue'),
    'Due Soon': allReminders.filter((r) => r.status === 'Due Soon'),
    Upcoming: allReminders.filter((r) => r.status === 'Upcoming'),
  };

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.petId) next.petId = 'Select a pet.';
    if (!form.date) next.date = 'Date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage('Please fill all required fields.');
      return;
    }
    const pet = pets.find((p) => p.id === form.petId);
    const next = [
      ...custom,
      {
        id: generateId('rem'),
        title: form.title.trim(),
        petId: form.petId,
        petName: pet?.name || 'Unknown',
        date: form.date,
        description: form.description.trim(),
        type: 'custom',
        createdAt: new Date().toISOString(),
      },
    ];
    saveReminders(user.id, next);
    setCustom(next);
    setOpen(false);
    setForm(EMPTY);
    setMessage('Reminder added successfully.');
    setTimeout(() => setMessage(''), 2500);
  };

  const onDelete = (id) => {
    if (!window.confirm('Delete this custom reminder?')) return;
    const next = custom.filter((r) => r.id !== id);
    saveReminders(user.id, next);
    setCustom(next);
    setMessage('Reminder deleted.');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Reminders</h2>
          <p>Vaccination due dates and custom health reminders.</p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={pets.length === 0}>
          + Custom Reminder
        </Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {allReminders.length === 0 ? (
        <EmptyState
          title="No reminders"
          message="Vaccination due dates and custom reminders will show here."
        />
      ) : (
        Object.entries(grouped).map(([label, items]) =>
          items.length === 0 ? null : (
            <Card key={label} title={`${label} (${items.length})`}>
              <ul className="reminder-list">
                {items.map((r) => (
                  <li key={r.id} className={`reminder-item status-border-${r.status.toLowerCase().replace(' ', '-')}`}>
                    <div>
                      <div className="reminder-title-row">
                        <strong>{r.title}</strong>
                        <StatusBadge status={r.status} />
                      </div>
                      <p>
                        {r.petName} · {formatDate(r.date)}
                        {r.type === 'vaccination' ? ' · Auto' : ' · Custom'}
                      </p>
                      {r.description && <p className="muted">{r.description}</p>}
                    </div>
                    {r.type === 'custom' && (
                      <Button variant="danger" onClick={() => onDelete(r.id)}>
                        Delete
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )
        )
      )}

      <Modal open={open} title="Add Custom Reminder" onClose={() => setOpen(false)} footer={null}>
        <form className="form-grid single" onSubmit={onSave} noValidate>
          <FormInput
            label="Title"
            name="title"
            value={form.title}
            onChange={onChange}
            required
            error={errors.title}
            placeholder="e.g. Deworming"
          />
          <FormInput
            label="Pet"
            name="petId"
            as="select"
            value={form.petId}
            onChange={onChange}
            required
            error={errors.petId}
            options={pets.map((p) => ({ value: p.id, label: p.name }))}
          />
          <FormInput
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            required
            error={errors.date}
          />
          <FormInput
            label="Description"
            name="description"
            as="textarea"
            value={form.description}
            onChange={onChange}
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Reminder</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
