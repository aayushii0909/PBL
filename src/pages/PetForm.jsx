import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPetById, addPet, updatePet } from '../services/api';
import { isValidPhone } from '../utils/helpers';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';

const EMPTY = {
  name: '',
  species: '',
  breed: '',
  gender: '',
  dateOfBirth: '',
  weight: '',
  color: '',
  ownerContact: '',
  allergies: '',
  notes: '',
  photo: '',
};

export default function PetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      setLoading(true);
      const result = await getPetById(id);
      if (!result.success || !result.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const pet = result.data;
      setForm({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        gender: pet.gender || '',
        dateOfBirth: pet.dateOfBirth || '',
        weight: pet.weight || '',
        color: pet.color || '',
        ownerContact: pet.ownerContact || '',
        allergies: pet.allergies || '',
        notes: pet.notes || '',
        photo: pet.photo || '',
      });
      setLoading(false);
    };
    load();
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setMessage('');
  };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please select an image file.' }));
      return;
    }
    if (file.size > 500 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be under 500KB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
      setErrors((prev) => ({ ...prev, photo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Pet name is required.';
    if (!form.species.trim()) next.species = 'Species is required.';
    if (!form.gender) next.gender = 'Gender is required.';
    if (form.ownerContact && !isValidPhone(form.ownerContact)) {
      next.ownerContact = 'Enter a valid 10-digit phone number.';
    }
    if (form.weight && Number(form.weight) <= 0) next.weight = 'Enter a valid weight.';
    if (form.dateOfBirth) {
      const d = new Date(form.dateOfBirth);
      if (Number.isNaN(d.getTime()) || d > new Date()) {
        next.dateOfBirth = 'Enter a valid date of birth.';
      }
    }
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
    const payload = {
      ...form,
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth || null,
    };

    const result = isEdit ? await updatePet(id, payload) : await addPet(payload);
    setSubmitting(false);

    if (!result.success) {
      setMessage(result.message || 'Something went wrong.');
      return;
    }

    setMessage(isEdit ? 'Pet updated successfully.' : 'Pet added successfully.');
    setTimeout(() => navigate('/pets'), 900);
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading pet...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <Card title="Pet not found">
        <p>This pet does not exist or was deleted.</p>
        <Button onClick={() => navigate('/pets')}>Back to My Pets</Button>
      </Card>
    );
  }

  return (
    <div className="page-stack narrow">
      <div className="page-toolbar">
        <div>
          <h2>{isEdit ? 'Edit Pet' : 'Add New Pet'}</h2>
          <p>{isEdit ? 'Update pet profile details.' : 'Create a new pet health profile.'}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/pets')}>
          Cancel
        </Button>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <Card>
        <form className="form-grid" onSubmit={onSubmit} noValidate>
          <FormInput label="Pet Name" name="name" value={form.name} onChange={onChange} required error={errors.name} />
          <FormInput
            label="Species"
            name="species"
            as="select"
            value={form.species}
            onChange={onChange}
            required
            error={errors.species}
            options={['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']}
          />
          <FormInput label="Breed" name="breed" value={form.breed} onChange={onChange} placeholder="e.g. Labrador" />
          <FormInput
            label="Gender"
            name="gender"
            as="select"
            value={form.gender}
            onChange={onChange}
            required
            error={errors.gender}
            options={['Male', 'Female']}
          />
          <FormInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={onChange}
            error={errors.dateOfBirth}
          />
          <FormInput
            label="Weight (kg)"
            name="weight"
            type="number"
            value={form.weight}
            onChange={onChange}
            placeholder="e.g. 12"
            error={errors.weight}
          />
          <FormInput label="Color" name="color" value={form.color} onChange={onChange} />
          <FormInput
            label="Owner Contact"
            name="ownerContact"
            type="tel"
            value={form.ownerContact}
            onChange={onChange}
            placeholder="10-digit number"
            error={errors.ownerContact}
          />
          <FormInput
            label="Allergies"
            name="allergies"
            as="textarea"
            value={form.allergies}
            onChange={onChange}
            placeholder="List known allergies"
          />
          <FormInput
            label="Notes"
            name="notes"
            as="textarea"
            value={form.notes}
            onChange={onChange}
            placeholder="Additional notes"
          />
          <div className="form-group full">
            <label htmlFor="photo">Pet Photo (optional, max 500KB)</label>
            <input id="photo" name="photo" type="file" accept="image/*" onChange={onPhotoChange} />
            {errors.photo && <p className="field-error">{errors.photo}</p>}
            {form.photo && (
              <div className="photo-preview">
                <img src={form.photo} alt="Pet preview" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForm((prev) => ({ ...prev, photo: '' }))}
                >
                  Remove photo
                </Button>
              </div>
            )}
          </div>
          <div className="form-actions full">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
