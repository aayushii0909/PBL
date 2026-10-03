import { useEffect, useMemo, useState } from 'react';
import {
  getPets,
  getVaccinations,
  addVaccination,
  updateVaccination,
  deleteVaccination,
} from '../services/api';
import { formatDate, getDueStatus } from '../utils/helpers';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';

const EMPTY = {
  petId: '',
  vaccineName: '',
  dateGiven: '',
  nextDueDate: '',
  veterinarian: '',
  notes: '',
};

export default function Vaccinations() {
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [petsRes, vacRes] = await Promise.all([getPets(), getVaccinations()]);
    if (!petsRes.success || !vacRes.success) {
      setError(petsRes.message || vacRes.message || 'Failed to load data.');
    } else {
      setPets(petsRes.data || []);
      setRecords(vacRes.data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () =>
      [...records]
        .map((r) => ({ ...r, status: getDueStatus(r.nextDueDate) }))
        .sort((a, b) => new Date(b.dateGiven || 0) - new Date(a.dateGiven || 0)),
    [records]
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (rec) => {
    setEditingId(rec.id);
    setForm({
      petId: rec.petId,
      vaccineName: rec.vaccineName,
      dateGiven: rec.dateGiven,
      nextDueDate: rec.nextDueDate,
      veterinarian: rec.veterinarian || '',
      notes: rec.notes || '',
    });
    setErrors({});
    setOpen(true);
  };

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.petId) next.petId = 'Select a pet.';
    if (!form.vaccineName.trim()) next.vaccineName = 'Vaccine name is required.';
    if (!form.dateGiven) next.dateGiven = 'Date given is required.';
    if (!form.nextDueDate) next.nextDueDate = 'Next due date is required.';
    if (form.dateGiven && form.nextDueDate && form.nextDueDate < form.dateGiven) {
      next.nextDueDate = 'Next due date should be after date given.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage('Please fill all required fields.');
      return;
    }
    const payload = {
      ...form,
      vaccineName: form.vaccineName.trim(),
      veterinarian: form.veterinarian.trim(),
      notes: form.notes.trim(),
    };

    const result = editingId
      ? await updateVaccination(editingId, payload)
      : await addVaccination(payload);

    if (!result.success) {
      setMessage(result.message || 'Failed to save.');
      return;
    }

    setOpen(false);
    setMessage('Vaccination record saved.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  const onDelete = async (rec) => {
    if (!window.confirm(`Delete vaccination "${rec.vaccineName}" for ${rec.petName}?`)) return;
    const result = await deleteVaccination(rec.id);
    if (!result.success) {
      setError(result.message || 'Failed to delete.');
      return;
    }
    setMessage('Vaccination deleted successfully.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading vaccinations...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Vaccinations</h2>
          <p>Track vaccines given and upcoming due dates.</p>
        </div>
        <Button onClick={openAdd} disabled={pets.length === 0}>
          + Add Vaccination
        </Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {pets.length === 0 && (
        <div className="alert alert-info">Add a pet first before creating vaccination records.</div>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title="No vaccination records"
          message="Add vaccines to track due dates and status."
          action={pets.length > 0 ? <Button onClick={openAdd}>+ Add Vaccination</Button> : null}
        />
      ) : (
        <Card>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Vaccine</th>
                  <th>Date Given</th>
                  <th>Next Due</th>
                  <th>Veterinarian</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.petName}</td>
                    <td>{r.vaccineName}</td>
                    <td>{formatDate(r.dateGiven)}</td>
                    <td>{formatDate(r.nextDueDate)}</td>
                    <td>{r.veterinarian || '—'}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="row-actions">
                      <Button variant="ghost" onClick={() => openEdit(r)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(r)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={open}
        title={editingId ? 'Edit Vaccination' : 'Add Vaccination'}
        onClose={() => setOpen(false)}
        footer={null}
      >
        <form className="form-grid single" onSubmit={onSave} noValidate>
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
            label="Vaccine Name"
            name="vaccineName"
            value={form.vaccineName}
            onChange={onChange}
            required
            error={errors.vaccineName}
            placeholder="e.g. Rabies"
          />
          <FormInput
            label="Date Given"
            name="dateGiven"
            type="date"
            value={form.dateGiven}
            onChange={onChange}
            required
            error={errors.dateGiven}
          />
          <FormInput
            label="Next Due Date"
            name="nextDueDate"
            type="date"
            value={form.nextDueDate}
            onChange={onChange}
            required
            error={errors.nextDueDate}
          />
          <FormInput
            label="Veterinarian"
            name="veterinarian"
            value={form.veterinarian}
            onChange={onChange}
            placeholder="Dr. Name"
          />
          <FormInput label="Notes" name="notes" as="textarea" value={form.notes} onChange={onChange} />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
