import { useEffect, useMemo, useState } from 'react';
import {
  getPets,
  getMedicalRecords,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../services/api';
import { formatDate } from '../utils/helpers';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';

const EMPTY = {
  petId: '',
  date: '',
  diagnosis: '',
  treatment: '',
  medicine: '',
  veterinarian: '',
  notes: '',
};

export default function MedicalHistory() {
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [viewRec, setViewRec] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [petsRes, medRes] = await Promise.all([getPets(), getMedicalRecords()]);
    if (!petsRes.success || !medRes.success) {
      setError(petsRes.message || medRes.message || 'Failed to load data.');
    } else {
      setPets(petsRes.data || []);
      setRecords(medRes.data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () => [...records].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)),
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
      date: rec.date,
      diagnosis: rec.diagnosis,
      treatment: rec.treatment || '',
      medicine: rec.medicine || '',
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
    if (!form.date) next.date = 'Date is required.';
    if (!form.diagnosis.trim()) next.diagnosis = 'Diagnosis/condition is required.';
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
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatment.trim(),
      medicine: form.medicine.trim(),
      veterinarian: form.veterinarian.trim(),
      notes: form.notes.trim(),
    };

    const result = editingId
      ? await updateMedicalRecord(editingId, payload)
      : await addMedicalRecord(payload);

    if (!result.success) {
      setMessage(result.message || 'Failed to save.');
      return;
    }

    setOpen(false);
    setMessage('Medical record saved.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  const onDelete = async (rec) => {
    if (!window.confirm(`Delete medical record for ${rec.petName}?`)) return;
    const result = await deleteMedicalRecord(rec.id);
    if (!result.success) {
      setError(result.message || 'Failed to delete.');
      return;
    }
    setMessage('Medical record deleted.');
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading medical records...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Medical History</h2>
          <p>Store diagnosis, treatment and medicine details.</p>
        </div>
        <Button onClick={openAdd} disabled={pets.length === 0}>
          + Add Record
        </Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {rows.length === 0 ? (
        <EmptyState
          title="No medical records"
          message="Add medical history for your pets."
          action={pets.length > 0 ? <Button onClick={openAdd}>+ Add Record</Button> : null}
        />
      ) : (
        <div className="record-cards">
          {rows.map((r) => (
            <Card key={r.id} className="record-card">
              <div className="record-card-top">
                <div>
                  <h3>{r.diagnosis}</h3>
                  <p>
                    {r.petName} · {formatDate(r.date)}
                  </p>
                </div>
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => setViewRec(r)}>
                    View
                  </Button>
                  <Button variant="secondary" onClick={() => openEdit(r)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(r)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="record-snippet">
                <span>Treatment: {r.treatment || '—'}</span>
                <span>Medicine: {r.medicine || '—'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!viewRec} title="Medical Record" onClose={() => setViewRec(null)}>
        {viewRec && (
          <div className="detail-grid">
            <div>
              <span>Pet</span>
              <strong>{viewRec.petName}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{formatDate(viewRec.date)}</strong>
            </div>
            <div className="full">
              <span>Diagnosis / Condition</span>
              <strong>{viewRec.diagnosis}</strong>
            </div>
            <div className="full">
              <span>Treatment</span>
              <strong>{viewRec.treatment || '—'}</strong>
            </div>
            <div>
              <span>Medicine</span>
              <strong>{viewRec.medicine || '—'}</strong>
            </div>
            <div>
              <span>Veterinarian</span>
              <strong>{viewRec.veterinarian || '—'}</strong>
            </div>
            <div className="full">
              <span>Notes</span>
              <strong>{viewRec.notes || '—'}</strong>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={open}
        title={editingId ? 'Edit Medical Record' : 'Add Medical Record'}
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
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            required
            error={errors.date}
          />
          <FormInput
            label="Diagnosis / Condition"
            name="diagnosis"
            value={form.diagnosis}
            onChange={onChange}
            required
            error={errors.diagnosis}
          />
          <FormInput label="Treatment" name="treatment" value={form.treatment} onChange={onChange} />
          <FormInput label="Medicine" name="medicine" value={form.medicine} onChange={onChange} />
          <FormInput
            label="Veterinarian"
            name="veterinarian"
            value={form.veterinarian}
            onChange={onChange}
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
