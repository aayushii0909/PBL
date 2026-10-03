import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPets, deletePet } from '../services/api';
import PetCard from '../components/PetCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { calculateAge, formatDate } from '../utils/helpers';

export default function MyPets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPet, setViewPet] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPets = async () => {
    setLoading(true);
    const result = await getPets();
    if (!result.success) {
      setError(result.message || 'Failed to load pets.');
      setPets([]);
    } else {
      setPets(result.data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPets();
  }, []);

  const sorted = useMemo(
    () => [...pets].sort((a, b) => a.name.localeCompare(b.name)),
    [pets]
  );

  const handleDelete = async (pet) => {
    if (!window.confirm(`Delete ${pet.name}? This cannot be undone.`)) return;
    const result = await deletePet(pet.id);
    if (!result.success) {
      setError(result.message || 'Failed to delete pet.');
      return;
    }
    setMessage(`${pet.name} deleted successfully.`);
    setTimeout(() => setMessage(''), 2500);
    loadPets();
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>My Pets</h2>
          <p>Manage all your pet profiles in one place.</p>
        </div>
        <Button onClick={() => navigate('/pets/add')}>+ Add New Pet</Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {sorted.length === 0 ? (
        <EmptyState
          title="No pets added"
          message="Create a pet profile to start tracking health records."
          action={<Button onClick={() => navigate('/pets/add')}>+ Add New Pet</Button>}
        />
      ) : (
        <div className="pet-grid">
          {sorted.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onView={setViewPet}
              onEdit={(p) => navigate(`/pets/edit/${p.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!viewPet}
        title={viewPet?.name || 'Pet Details'}
        onClose={() => setViewPet(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewPet(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigate(`/pets/edit/${viewPet.id}`);
              }}
            >
              Edit
            </Button>
          </>
        }
      >
        {viewPet && (
          <div className="detail-grid">
            <div>
              <span>Species</span>
              <strong>{viewPet.species}</strong>
            </div>
            <div>
              <span>Breed</span>
              <strong>{viewPet.breed || '—'}</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>{viewPet.gender || '—'}</strong>
            </div>
            <div>
              <span>Date of Birth</span>
              <strong>{formatDate(viewPet.dateOfBirth)}</strong>
            </div>
            <div>
              <span>Age</span>
              <strong>{calculateAge(viewPet.dateOfBirth)}</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>{viewPet.weight ? `${viewPet.weight} kg` : '—'}</strong>
            </div>
            <div>
              <span>Color</span>
              <strong>{viewPet.color || '—'}</strong>
            </div>
            <div>
              <span>Owner Contact</span>
              <strong>{viewPet.ownerContact || '—'}</strong>
            </div>
            <div className="full">
              <span>Allergies</span>
              <strong>{viewPet.allergies || '—'}</strong>
            </div>
            <div className="full">
              <span>Notes</span>
              <strong>{viewPet.notes || '—'}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
