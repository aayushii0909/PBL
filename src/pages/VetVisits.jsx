import { useEffect, useMemo, useState } from 'react';
import {
  getPets,
  getVetVisits,
  addVetVisit,
  updateVetVisit,
  deleteVetVisit,
} from '../services/api';
import { formatDate } from '../utils/helpers';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';

const EMPTY = {
  petId: '',
  veterinarianName: '',
  clinicName: '',
  visitDate: '',
  reason: '',
  treatment: '',
  notes: '',
};

export default function VetVisits() {
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
    const [petsRes, visitRes] = await Promise.all([getPets(), getVetVisits()]);
    if (!petsRes.success || !visitRes.success) {
      setError(petsRes.message || visitRes.message || 'Failed to load data.');
    } else {
      setPets(petsRes.data || []);
      setRecords(visitRes.data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () => [...records].sort((a, b) => new Date(b.visitDate || 0) - new Date(a.visitDate || 0)),
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
      veterinarianName: rec.veterinarianName || '',
      clinicName: rec.clinicName || '',
      visitDate: rec.visitDate || '',
      reason: rec.reason || '',
      treatment: rec.treatment || '',
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
    if (!form.veterinarianName.trim()) next.veterinarianName = 'Veterinarian name is required.';
    if (!form.visitDate) next.visitDate = 'Visit date is required.';
    if (!form.reason.trim()) next.reason = 'Reason for visit is required.';
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
      veterinarianName: form.veterinarianName.trim(),
      clinicName: form.clinicName.trim(),
      reason: form.reason.trim(),
      treatment: form.treatment.trim(),
      notes: form.notes.trim(),
    };

    const result = editingId ? await updateVetVisit(editingId, payload) : await addVetVisit(payload);

    if (!result.success) {
      setMessage(result.message || 'Failed to save.');
      return;
    }

    setOpen(false);
    setMessage('Vet visit saved.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  const onDelete = async (rec) => {
    if (!window.confirm(`Delete vet visit for ${rec.petName}?`)) return;
    const result = await deleteVetVisit(rec.id);
    if (!result.success) {
      setError(result.message || 'Failed to delete.');
      return;
    }
    setMessage('Vet visit deleted.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading vet visits...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Vet Visits</h2>
          <p>Log clinic visits and treatments.</p>
        </div>
        <Button onClick={openAdd} disabled={pets.length === 0}>
          + Add Visit
        </Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {rows.length === 0 ? (
        <EmptyState
          title="No vet visits"
          message="Record clinic visits for your pets."
          action={pets.length > 0 ? <Button onClick={openAdd}>+ Add Visit</Button> : null}
        />
      ) : (
        <Card>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Veterinarian</th>
                  <th>Clinic</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.petName}</td>
                    <td>{r.veterinarianName}</td>
                    <td>{r.clinicName || '—'}</td>
                    <td>{formatDate(r.visitDate)}</td>
                    <td>{r.reason}</td>
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
        title={editingId ? 'Edit Vet Visit' : 'Add Vet Visit'}
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
            label="Veterinarian Name"
            name="veterinarianName"
            value={form.veterinarianName}
            onChange={onChange}
            required
            error={errors.veterinarianName}
          />
          <FormInput
            label="Clinic Name"
            name="clinicName"
            value={form.clinicName}
            onChange={onChange}
          />
          <FormInput
            label="Visit Date"
            name="visitDate"
            type="date"
            value={form.visitDate}
            onChange={onChange}
            required
            error={errors.visitDate}
          />
          <FormInput
            label="Reason for Visit"
            name="reason"
            value={form.reason}
            onChange={onChange}
            required
            error={errors.reason}
          />
          <FormInput label="Treatment" name="treatment" value={form.treatment} onChange={onChange} />
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
