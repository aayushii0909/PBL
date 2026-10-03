import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmergency, saveEmergency } from '../utils/auth';
import { isValidPhone } from '../utils/helpers';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';

const EMPTY = {
  pet: {
    petName: '',
    species: '',
    breed: '',
    bloodGroup: '',
    allergies: '',
    currentMedication: '',
    importantNotes: '',
  },
  veterinarian: {
    name: '',
    clinicName: '',
    phone: '',
    address: '',
  },
  contact: {
    name: '',
    relationship: '',
    phone: '',
  },
};

export default function Emergency() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => getEmergency(user.id) || EMPTY);
  const [editing, setEditing] = useState(!getEmergency(user.id));
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const onNestedChange = (section, e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
    setErrors((prev) => ({ ...prev, [`${section}.${name}`]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.pet.petName.trim()) next['pet.petName'] = 'Pet name is required.';
    if (!form.pet.species.trim()) next['pet.species'] = 'Species is required.';
    if (form.veterinarian.phone && !isValidPhone(form.veterinarian.phone)) {
      next['veterinarian.phone'] = 'Enter a valid 10-digit phone.';
    }
    if (form.contact.phone && !isValidPhone(form.contact.phone)) {
      next['contact.phone'] = 'Enter a valid 10-digit phone.';
    }
    if (!form.contact.name.trim()) next['contact.name'] = 'Emergency contact name is required.';
    if (!form.contact.phone.trim()) next['contact.phone'] = 'Emergency contact phone is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage('Please fill all required fields.');
      return;
    }
    saveEmergency(user.id, form);
    setEditing(false);
    setMessage('Emergency information saved.');
    setTimeout(() => setMessage(''), 2500);
  };

  const data = form;

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Emergency Information</h2>
          <p>Keep critical details ready. This is not connected to real emergency services.</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Information</Button>
        )}
      </div>

      {message && (
        <div className={`alert ${message.includes('saved') || message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="emergency-banner">
        <strong>Emergency Information</strong>
        <span>For quick reference during urgent situations. Contact your veterinarian directly.</span>
      </div>

      {!editing ? (
        <div className="emergency-display">
          <Card title="Pet Emergency Information" className="emergency-card">
            <div className="detail-grid">
              <div>
                <span>Pet Name</span>
                <strong>{data.pet.petName || '—'}</strong>
              </div>
              <div>
                <span>Species</span>
                <strong>{data.pet.species || '—'}</strong>
              </div>
              <div>
                <span>Breed</span>
                <strong>{data.pet.breed || '—'}</strong>
              </div>
              <div>
                <span>Blood Group</span>
                <strong>{data.pet.bloodGroup || '—'}</strong>
              </div>
              <div className="full">
                <span>Allergies</span>
                <strong>{data.pet.allergies || '—'}</strong>
              </div>
              <div className="full">
                <span>Current Medication</span>
                <strong>{data.pet.currentMedication || '—'}</strong>
              </div>
              <div className="full">
                <span>Important Medical Notes</span>
                <strong>{data.pet.importantNotes || '—'}</strong>
              </div>
            </div>
          </Card>

          <Card title="Veterinarian Information" className="emergency-card">
            <div className="detail-grid">
              <div>
                <span>Veterinarian</span>
                <strong>{data.veterinarian.name || '—'}</strong>
              </div>
              <div>
                <span>Clinic</span>
                <strong>{data.veterinarian.clinicName || '—'}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{data.veterinarian.phone || '—'}</strong>
              </div>
              <div className="full">
                <span>Address</span>
                <strong>{data.veterinarian.address || '—'}</strong>
              </div>
            </div>
          </Card>

          <Card title="Emergency Contact" className="emergency-card">
            <div className="detail-grid">
              <div>
                <span>Contact Name</span>
                <strong>{data.contact.name || '—'}</strong>
              </div>
              <div>
                <span>Relationship</span>
                <strong>{data.contact.relationship || '—'}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{data.contact.phone || '—'}</strong>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <form onSubmit={onSave} className="page-stack" noValidate>
          <Card title="Pet Emergency Information">
            <div className="form-grid">
              <FormInput
                label="Pet Name"
                name="petName"
                value={form.pet.petName}
                onChange={(e) => onNestedChange('pet', e)}
                required
                error={errors['pet.petName']}
              />
              <FormInput
                label="Species"
                name="species"
                value={form.pet.species}
                onChange={(e) => onNestedChange('pet', e)}
                required
                error={errors['pet.species']}
              />
              <FormInput
                label="Breed"
                name="breed"
                value={form.pet.breed}
                onChange={(e) => onNestedChange('pet', e)}
              />
              <FormInput
                label="Blood Group"
                name="bloodGroup"
                value={form.pet.bloodGroup}
                onChange={(e) => onNestedChange('pet', e)}
                placeholder="Optional"
              />
              <FormInput
                label="Allergies"
                name="allergies"
                as="textarea"
                value={form.pet.allergies}
                onChange={(e) => onNestedChange('pet', e)}
              />
              <FormInput
                label="Current Medication"
                name="currentMedication"
                as="textarea"
                value={form.pet.currentMedication}
                onChange={(e) => onNestedChange('pet', e)}
              />
              <FormInput
                label="Important Medical Notes"
                name="importantNotes"
                as="textarea"
                value={form.pet.importantNotes}
                onChange={(e) => onNestedChange('pet', e)}
                className="full"
              />
            </div>
          </Card>

          <Card title="Veterinarian Information">
            <div className="form-grid">
              <FormInput
                label="Veterinarian Name"
                name="name"
                value={form.veterinarian.name}
                onChange={(e) => onNestedChange('veterinarian', e)}
              />
              <FormInput
                label="Clinic Name"
                name="clinicName"
                value={form.veterinarian.clinicName}
                onChange={(e) => onNestedChange('veterinarian', e)}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.veterinarian.phone}
                onChange={(e) => onNestedChange('veterinarian', e)}
                error={errors['veterinarian.phone']}
              />
              <FormInput
                label="Clinic Address"
                name="address"
                as="textarea"
                value={form.veterinarian.address}
                onChange={(e) => onNestedChange('veterinarian', e)}
              />
            </div>
          </Card>

          <Card title="Emergency Contact">
            <div className="form-grid">
              <FormInput
                label="Contact Name"
                name="name"
                value={form.contact.name}
                onChange={(e) => onNestedChange('contact', e)}
                required
                error={errors['contact.name']}
              />
              <FormInput
                label="Relationship"
                name="relationship"
                value={form.contact.relationship}
                onChange={(e) => onNestedChange('contact', e)}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.contact.phone}
                onChange={(e) => onNestedChange('contact', e)}
                required
                error={errors['contact.phone']}
              />
            </div>
          </Card>

          <div className="form-actions">
            {getEmergency(user.id) && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setForm(getEmergency(user.id) || EMPTY);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button type="submit">Save Emergency Info</Button>
          </div>
        </form>
      )}
    </div>
  );
}
